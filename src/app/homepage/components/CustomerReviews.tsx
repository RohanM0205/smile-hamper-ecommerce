"use client";

import React, { useRef } from "react";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

interface Review {
  id: string;
  name: string;
  avatar: string;
  avatarAlt: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
}

const reviews: Review[] = [
{
  id: "rev_1",
  name: "Priya Sharma",
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f14adb68-1763294281254.png",
  avatarAlt: "Portrait of Priya Sharma, smiling woman with long dark hair",
  rating: 5,
  review:
  "Absolutely loved the birthday hamper! The packaging was so elegant and my sister was thrilled. Will definitely order again.",
  date: "2 days ago",
  verified: true
},
{
  id: "rev_2",
  name: "Rajesh Kumar",
  avatar: "https://images.unsplash.com/photo-1713819487476-c5995c3a5959",
  avatarAlt: "Portrait of Rajesh Kumar, man with short black hair and beard",
  rating: 5,
  review:
  "Perfect for corporate gifting. Ordered 50 hampers for Diwali and everyone appreciated the quality. Great service!",
  date: "1 week ago",
  verified: true
},
{
  id: "rev_3",
  name: "Ananya Patel",
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1658b37dd-1763299021458.png",
  avatarAlt: "Portrait of Ananya Patel, woman with wavy brown hair smiling",
  rating: 5,
  review:
  "Same day delivery was a lifesaver! Forgot my friend's anniversary and TheSmileHamper saved the day. Thank you!",
  date: "3 days ago",
  verified: true
},
{
  id: "rev_4",
  name: "Vikram Singh",
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_175263844-1763295500363.png",
  avatarAlt: "Portrait of Vikram Singh, man with short hair and friendly smile",
  rating: 4,
  review:
  "Great selection of products. The chocolate hamper was delicious. Only wish there were more customization options.",
  date: "5 days ago",
  verified: true
},
{
  id: "rev_5",
  name: "Meera Reddy",
  avatar: "https://images.unsplash.com/photo-1673020993030-ff0af96852d9",
  avatarAlt: "Portrait of Meera Reddy, woman with long black hair",
  rating: 5,
  review:
  "The personalized message card was such a nice touch. My mom loved the wellness hamper. Highly recommend!",
  date: "1 week ago",
  verified: true
}];


const CustomerReviews: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-2 block">
              Testimonials
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              What Our Customers Say
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
              aria-label="Scroll left">

              <Icon name="ChevronLeftIcon" size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              aria-label="Scroll right">

              <Icon name="ChevronRightIcon" size={20} />
            </button>
          </div>
        </div>

        {/* Reviews Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory">

          {reviews.map((review) =>
          <div
            key={review.id}
            className="min-w-[320px] md:min-w-[400px] bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300 snap-center">

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) =>
              <Icon
                key={`star_${review.id}_${i}`}
                name="StarIcon"
                size={18}
                variant={i < review.rating ? "solid" : "outline"}
                className="text-yellow-500" />

              )}
              </div>

              {/* Review Text */}
              <p className="text-foreground leading-relaxed mb-6">
                "{review.review}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3">
                <AppImage
                src={review.avatar}
                alt={review.avatarAlt}
                className="w-12 h-12 rounded-full object-cover" />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">
                      {review.name}
                    </h4>
                    {review.verified &&
                  <Icon
                    name="CheckBadgeIcon"
                    size={16}
                    className="text-success" />

                  }
                  </div>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Overall Rating */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-card border border-border rounded-2xl px-8 py-4">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) =>
              <Icon
                key={`overall_star_${i}`}
                name="StarIcon"
                size={24}
                variant="solid"
                className="text-yellow-500" />

              )}
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-left">
              <div className="font-serif text-2xl text-foreground">4.8</div>
              <div className="text-xs text-muted-foreground">
                10,000+ Reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default CustomerReviews;