import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ categoryId: string }>;
}

export async function GET(
  _req: Request,
  context: RouteContext
) {
  try {
    const { categoryId } = await context.params;

    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        price,
        discount_price,
        product_images (
          image_url,
          is_primary
        )
      `)
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .limit(4);

    if (error) {
      console.error("Similar products error:", error);
      return NextResponse.json(
        { error: "Failed to fetch similar products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data });
  } catch (err) {
    console.error("Similar route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
