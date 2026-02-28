import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId, quantity } = await req.json();

  const { data: cartItem, error: cartError } = await supabase
    .from("cart_items")
    .select("product_id")
    .eq("id", itemId)
    .single();

  if (cartError || !cartItem) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", cartItem.product_id)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (quantity > product.stock) {
    return NextResponse.json(
      { error: "Quantity exceeds available stock", stock: product.stock },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
