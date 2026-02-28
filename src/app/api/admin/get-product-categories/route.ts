import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Missing productId" },
      { status: 400 }
    );
  }

  const supabase = await supabaseServer();

  const { data } = await supabase
    .from("product_categories")
    .select("category_id, categories(name)")
    .eq("product_id", productId);

  return NextResponse.json({ data });
}
