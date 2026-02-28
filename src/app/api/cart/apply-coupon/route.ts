import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

interface CartItemWithProduct {
  quantity: number;
  products: {
    price: number;
    discount_price: number | null;
  } | null;
}

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();

    /* ================= AUTH ================= */

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code required" },
        { status: 400 }
      );
    }

    /* ================= FETCH COUPON ================= */

    const { data: coupon, error: couponError } =
      await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .single();

    if (couponError || !coupon) {
      return NextResponse.json(
        { error: "Invalid coupon" },
        { status: 400 }
      );
    }

    if (!coupon.is_active) {
      return NextResponse.json(
        { error: "Coupon inactive" },
        { status: 400 }
      );
    }

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
      coupon.usage_limit &&
      coupon.used_count >= coupon.usage_limit
    ) {
      return NextResponse.json(
        { error: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    /* ================= FETCH CART ================= */

    const { data: cart, error: cartError } =
      await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (cartError || !cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 400 }
      );
    }

    /* ================= FETCH CART ITEMS ================= */

    const { data: items, error: itemsError } =
      await supabase
        .from("cart_items")
        .select(`
          quantity,
          products (
            price,
            discount_price
          )
        `)
        .eq("cart_id", cart.id);

    if (itemsError) {
      console.error("Cart items fetch error:", itemsError);
      return NextResponse.json(
        { error: "Failed to fetch cart items" },
        { status: 500 }
      );
    }

    const typedItems = (items ?? []) as unknown as CartItemWithProduct[];

    /* ================= SAFE SUBTOTAL ================= */

    let subtotal = 0;

    for (const item of typedItems) {
      if (!item.products) continue;

      const price =
        item.products.discount_price ??
        item.products.price;

      subtotal += Number(price) * item.quantity;
    }

    /* ================= MIN CART CHECK ================= */

    if (
      coupon.min_cart_value &&
      subtotal < coupon.min_cart_value
    ) {
      return NextResponse.json(
        {
          error: `Minimum cart value ₹${coupon.min_cart_value} required`,
        },
        { status: 400 }
      );
    }

    /* ================= PER USER LIMIT CHECK ================= */

    if (coupon.per_user_limit) {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("coupon_id", coupon.id);

      if (count && count >= coupon.per_user_limit) {
        return NextResponse.json(
          { error: "Coupon usage limit per user reached" },
          { status: 400 }
        );
      }
    }

    /* ================= ATTACH COUPON TO CART ================= */

    const { error: updateError } =
      await supabase
        .from("carts")
        .update({ coupon_id: coupon.id })
        .eq("id", cart.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to apply coupon" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (err) {
    console.error("Apply coupon error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
