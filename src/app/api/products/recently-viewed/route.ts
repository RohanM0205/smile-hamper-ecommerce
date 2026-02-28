import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { ids } = await req.json();

  const supabase = await supabaseServer();

  const { data } = await supabase
    .from("products")
    .select("id, name, price, slug, product_images(image_url, is_primary)")
    .in("id", ids)
    .eq("is_active", true);

  const products =
    data?.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      slug: p.slug,
      image_url:
        p.product_images?.find((i: any) => i.is_primary)?.image_url ||
        p.product_images?.[0]?.image_url,
    })) || [];

  return NextResponse.json({ products });
}