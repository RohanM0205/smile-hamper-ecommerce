import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { productId, categoryIds } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // 1️⃣ Delete old
    await supabase
      .from("product_categories")
      .delete()
      .eq("product_id", productId);

    // 2️⃣ Insert new
    if (categoryIds?.length > 0) {
      const payload = categoryIds.map((cid: string) => ({
        product_id: productId,
        category_id: cid,
      }));

      const { error } = await supabase
        .from("product_categories")
        .insert(payload);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Update categories error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
