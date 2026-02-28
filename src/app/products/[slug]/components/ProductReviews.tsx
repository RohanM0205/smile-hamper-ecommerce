"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/AppIcon";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  is_verified: boolean;
  profiles: {
    full_name: string;
  };
}

interface Props {
  productId: string;
}

export default function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [breakdown, setBreakdown] = useState<Record<number, number>>({});
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch(`/api/reviews/${productId}`);
    const data = await res.json();

    setReviews(data.reviews || []);
    setAvgRating(data.avgRating || 0);
    setTotalReviews(data.totalReviews || 0);
    setBreakdown(data.breakdown || {});
    setLoading(false);
  };

  const submitReview = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);

    await fetch("/api/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        rating,
        comment,
      }),
    });

    setComment("");
    setRating(5);
    await fetchReviews();
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-14">

      {/* ⭐ Rating Summary */}
      <div className="grid md:grid-cols-2 gap-12 
                      bg-gradient-to-br from-[#f8f4ef] to-white
                      p-8 rounded-3xl
                      shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">

        <div className="space-y-3">
          <h2 className="text-5xl font-serif text-[#5a3e2b]">
            {avgRating.toFixed(1)}
          </h2>

          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name="StarIcon"
                size={22}
                className={
                  i < Math.round(avgRating)
                    ? "text-yellow-500"
                    : "text-yellow-200"
                }
              />
            ))}
          </div>

          <p className="text-muted-foreground">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] || 0;
            const percentage =
              totalReviews > 0
                ? (count / totalReviews) * 100
                : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-6 text-[#5a3e2b]">
                  {star}★
                </span>

                <div className="flex-1 bg-[#e8ded2] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="text-xs text-muted-foreground w-8">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✍️ Write Review */}
      <div className="bg-white p-6 rounded-2xl 
                      shadow-[0_15px_40px_-15px_rgba(0,0,0,0.12)]
                      border border-[#efe5da]">

        <h3 className="font-semibold text-lg mb-4 text-[#5a3e2b]">
          Write a Review
        </h3>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              type="button"
              className="transition-transform hover:scale-110"
            >
              <Icon
                name="StarIcon"
                size={24}
                className={
                  star <= rating
                    ? "text-yellow-500"
                    : "text-yellow-200"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-xl border border-[#e0d4c7] 
                     px-4 py-3 mb-4
                     focus:outline-none focus:ring-2 
                     focus:ring-[#7B4F2A]/40 transition"
          placeholder="Share your experience..."
        />

        <button
          onClick={submitReview}
          disabled={submitting || !comment.trim()}
          className="px-6 py-2 rounded-full 
                     bg-[#7B4F2A] text-white
                     hover:bg-[#6a4322]
                     transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* 📝 Reviews */}
      <div className="space-y-6">

        {reviews.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            No reviews yet. Be the first to share your experience!
          </div>
        )}

        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-2xl
                       shadow-[0_10px_30px_-15px_rgba(0,0,0,0.12)]
                       border border-[#f0e7dd]"
          >
            <div className="flex justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#5a3e2b]">
                  {review.profiles?.full_name || "User"}
                </span>

                {review.is_verified && (
                  <span className="text-xs px-2 py-1 
                                   bg-green-50 text-green-700 
                                   rounded-full border border-green-200">
                    Verified Purchase
                  </span>
                )}
              </div>

              <span className="text-sm text-muted-foreground">
                {new Date(
                  review.created_at
                ).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  name="StarIcon"
                  size={16}
                  className={
                    i < review.rating
                      ? "text-yellow-500"
                      : "text-yellow-200"
                  }
                />
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}