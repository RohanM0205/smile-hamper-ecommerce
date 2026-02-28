import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");

  if (!product_id) {
    return NextResponse.json({ data: [] });
  }

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("product_customization_fields")
    .select("*")
    .eq("product_id", product_id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data });
}
