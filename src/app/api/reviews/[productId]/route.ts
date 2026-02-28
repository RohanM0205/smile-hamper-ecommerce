import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ productId: string }>;
}

export async function GET(
  _req: Request,
  context: RouteContext
) {
  try {
    const { productId } = await context.params;

    const supabase = await supabaseServer();

    const { data: reviews, error: reviewsError } =
      await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          is_verified,
          profiles (
            full_name
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

    if (reviewsError) {
      console.error("Reviews error:", reviewsError);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    const { data: ratingData } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId);

    const totalReviews = ratingData?.length ?? 0;

    const avgRating =
      totalReviews > 0 && ratingData
        ? ratingData.reduce(
            (sum, r) => sum + r.rating,
            0
          ) / totalReviews
        : 0;

    const breakdown: Record<number, number> = {};

    ratingData?.forEach((r) => {
      breakdown[r.rating] =
        (breakdown[r.rating] || 0) + 1;
    });

    return NextResponse.json({
      reviews,
      avgRating,
      totalReviews,
      breakdown,
    });
  } catch (err) {
    console.error("Reviews route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
