import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const FREE_WRAP_THRESHOLD = 3000;

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { paymentMethod, addressId } = body;

if (!paymentMethod || !addressId) {
  return NextResponse.json(
    { error: "Invalid request" },
    { status: 400 }
  );
}

  /* ================= GET CART ================= */

  const { data: cart } = await supabase
    .from("carts")
    .select("id, coupon_id")
    .eq("user_id", user.id)
    .single();

  if (!cart) {
    return NextResponse.json(
      { error: "Cart not found" },
      { status: 400 }
    );
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      gift_wrap,
      custom_price,
      customization,
      products (
        id,
        name,
        price,
        discount_price,
        stock,
        gift_wrap_price
      )
    `)
    .eq("cart_id", cart.id);

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  type Product = {
    id: number;
    name: string;
    price: number;
    discount_price: number | null;
    stock: number;
    gift_wrap_price: number | null;
  };
  const getProduct = (p: Product | Product[]): Product =>
    Array.isArray(p) ? p[0] : p;
  const itemsWithProduct = cartItems.map((item) => ({
    ...item,
    product: getProduct(item.products as Product | Product[]),
  }));

  /* ================= RECALCULATE TOTAL ================= */

  let baseSubtotal = 0;

  for (const item of itemsWithProduct) {
    const unitPrice =
      item.custom_price ??
      item.product.discount_price ??
      item.product.price;

    baseSubtotal += unitPrice * item.quantity;
  }

  const isGiftWrapFree = baseSubtotal >= FREE_WRAP_THRESHOLD;

  let giftWrapTotal = 0;

  for (const item of itemsWithProduct) {
    if (!item.gift_wrap) continue;

    const wrapPrice = isGiftWrapFree
      ? 0
      : item.product.gift_wrap_price || 49;

    giftWrapTotal += wrapPrice * item.quantity;
  }

  const subtotal = baseSubtotal + giftWrapTotal;
  const shipping = subtotal > 2000 ? 0 : 99;

  /* ================= COUPON LOGIC ================= */

  let discount = 0;

  if (cart.coupon_id) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("id", cart.coupon_id)
      .eq("is_active", true)
      .single();

    if (coupon) {
      if (
        coupon.expiry_date &&
        new Date(coupon.expiry_date) < new Date()
      ) {
        return NextResponse.json(
          { error: "Coupon expired" },
          { status: 400 }
        );
      }

      if (
        coupon.min_cart_value &&
        subtotal < coupon.min_cart_value
      ) {
        discount = 0;
      } else {
        if (coupon.discount_type === "percent") {
          discount =
            (subtotal * coupon.discount_value) / 100;

          if (coupon.max_discount) {
            discount = Math.min(
              discount,
              coupon.max_discount
            );
          }
        } else {
          discount = coupon.discount_value;
        }
      }
    }
  }

  const finalTotal = subtotal - discount + shipping;

  /* ================= STOCK VALIDATION ================= */

  for (const item of itemsWithProduct) {
    if (item.quantity > item.product.stock) {
      return NextResponse.json(
        { error: `${item.product.name} is out of stock` },
        { status: 400 }
      );
    }
  }

  /* ================= CREATE ORDER ================= */

  const paymentStatus =
    paymentMethod === "cod"
      ? "cod_pending"
      : "awaiting_payment";

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: finalTotal,
        status: "pending",
        payment_status: paymentStatus,
        coupon_id: cart.coupon_id,
      })
      .select()
      .single();

  if (orderError) {
    return NextResponse.json(
      { error: orderError.message },
      { status: 400 }
    );
  }

  /* ================= INSERT ORDER ITEMS ================= */

  const orderItemsPayload = itemsWithProduct.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    price:
      item.custom_price ??
      item.product.discount_price ??
      item.product.price,
    quantity: item.quantity,
    customization: item.customization,
    custom_price: item.custom_price,
  }));

  const { error: itemsError } = await supabase
  .from("order_items")
  .insert(orderItemsPayload);

if (itemsError) {
  console.error("Order items insert failed:", itemsError);
  return NextResponse.json(
    { error: "Failed to create order items" },
    { status: 500 }
  );
}

  /* ================= INSERT SHIPPING SNAPSHOT ================= */

  // Fetch address securely
const { data: address } = await supabase
.from("user_addresses")
.select("*")
.eq("id", addressId)
.eq("user_id", user.id)
.single();

if (!address) {
return NextResponse.json(
  { error: "Invalid address" },
  { status: 400 }
);
}

// Insert snapshot
await supabase
.from("order_shipping_details")
.insert({
  order_id: order.id,
  full_name: address.full_name,
  email: address.email,
  phone: address.phone,
  address: address.address,
  city: address.city,
  state: address.state,
  pincode: address.pincode,
});

  /* ================= REDUCE STOCK (COD ONLY) ================= */
/* ================= RAZORPAY FLOW ================= */

if (paymentMethod === "razorpay") {
  const { razorpay } = await import("@/lib/razorpay");

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(finalTotal * 100), // convert to paise
    currency: "INR",
    receipt: order.id,
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    razorpayOrder,
  });
}

/* ================= COD FLOW ================= */

if (paymentMethod === "cod") {
  for (const item of itemsWithProduct) {
    await supabase
      .from("products")
      .update({
        stock: item.product.stock - item.quantity,
      })
      .eq("id", item.product.id);
  }

  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  await supabase
    .from("carts")
    .update({ coupon_id: null })
    .eq("id", cart.id);

  return NextResponse.json({
    success: true,
    orderId: order.id,
  });
}
  /* ================= CLEAR CART ================= */

  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  await supabase
    .from("carts")
    .update({ coupon_id: null })
    .eq("id", cart.id);

  return NextResponse.json({
    success: true,
    orderId: order.id,
  });
}