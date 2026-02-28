import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  // -----------------------------
  // 1️⃣ Get logged-in user
  // -----------------------------
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // -----------------------------
  // 2️⃣ Parse & validate input
  // -----------------------------
  const { productId, rating, comment } = await req.json();

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Invalid review data" },
      { status: 400 }
    );
  }

  // -----------------------------
  // 3️⃣ Prevent duplicate review
  // -----------------------------
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingReview) {
    return NextResponse.json(
      { error: "You have already reviewed this product" },
      { status: 400 }
    );
  }

  // -----------------------------
  // 4️⃣ Check verified purchase
  // -----------------------------
  // Check if user has ordered this product
  const { data: verifiedPurchase } = await supabase
    .from("order_items")
    .select("id, orders!inner(user_id)")
    .eq("product_id", productId)
    .eq("orders.user_id", user.id)
    .limit(1);

  const isVerified =
    verifiedPurchase && verifiedPurchase.length > 0;

  // -----------------------------
  // 5️⃣ Insert review
  // -----------------------------
  const { error: insertError } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment || null,
      is_verified: isVerified,
    });

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    verified: isVerified,
  });
}
