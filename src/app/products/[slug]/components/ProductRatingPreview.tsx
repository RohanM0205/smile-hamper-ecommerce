"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/AppIcon";

interface Props {
  productId: string;
}

export default function ProductRatingPreview({ productId }: Props) {
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch(`/api/reviews/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setAvg(data.avgRating || 0);
        setCount(data.totalReviews || 0);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading || count === 0) return null;

  const fullStars = Math.floor(avg);
  const hasHalfStar = avg - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-3 mb-4">

      {/* Stars */}
      <div className="flex items-center gap-1">
  {Array.from({ length: fullStars }).map((_, i) => (
    <Icon
      key={`full-${i}`}
      name="StarIcon"
      size={18}
      className="text-[#F4B400]"
    />
  ))}

  {hasHalfStar && (
    <Icon
      name="StarIcon"
      size={18}
      className="text-[#F4B400] opacity-60"
    />
  )}

  {Array.from({
    length: 5 - fullStars - (hasHalfStar ? 1 : 0),
  }).map((_, i) => (
    <Icon
      key={`empty-${i}`}
      name="StarIcon"
      size={18}
      className="text-[#F4B400]/25"
    />
  ))}
</div>

      {/* Text */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[#5a3e2b]">
          {avg.toFixed(1)}
        </span>

        <span className="text-sm text-muted-foreground">
          ({count} reviews)
        </span>
      </div>
    </div>
  );
}