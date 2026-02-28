import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID required" },
      { status: 400 }
    );
  }

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get order (ensure belongs to user)
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      price,
      customization,
      products (
        id,
        name,
        product_images (
          image_url,
          is_primary
        )
      )
    `)
    .eq("order_id", orderId);

  const { data: shipping } = await supabase
    .from("order_shipping_details")
    .select("*")
    .eq("order_id", orderId)
    .single();

  return NextResponse.json({
    order,
    items,
    shipping,
  });
}