import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  /* ================= UPDATE ORDER ================= */

  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_status: "paid",
      payment_id: razorpay_payment_id,
    })
    .eq("id", orderId);

  /* ================= REDUCE STOCK ================= */

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  for (const item of orderItems || []) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    if (!product) continue;

    await supabase
      .from("products")
      .update({
        stock: product.stock - item.quantity,
      })
      .eq("id", item.product_id);
  }

  /* ================= CLEAR CART ================= */

  const { data: order } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", order.user_id)
    .single();

  if (cart) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id);

    await supabase
      .from("carts")
      .update({ coupon_id: null })
      .eq("id", cart.id);
  }

  return NextResponse.json({ success: true });
}