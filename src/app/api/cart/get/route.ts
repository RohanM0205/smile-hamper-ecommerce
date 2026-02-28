import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get cart
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!cart) {
    return NextResponse.json({ items: [] });
  }

  // Get cart items with product info
  const { data: items } = await supabase
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
      gift_wrap_price,
      stock,
      product_images (
        image_url,
        is_primary
      )
    )
  `)
  .eq("cart_id", cart.id);

  return NextResponse.json({ items });
}
