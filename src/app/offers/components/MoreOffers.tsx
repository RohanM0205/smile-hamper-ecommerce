"use client";

import React, { useEffect, useState, useRef } from "react";
import Icon from "@/components/ui/AppIcon";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_cart_value: number;
  expiry_date: string;
}

interface Props {
  visible: boolean;
}

const ITEMS_PER_PAGE = 6;

const MoreOffers: React.FC<Props> = ({ visible }) => {
  const [offers, setOffers] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedRef = useRef(false);

  const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE);

  /* ================= FETCH OFFERS ================= */

  useEffect(() => {
    if (!visible) return;

    if (hasFetchedRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return;
    }

    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/offers");

        if (!res.ok) throw new Error("Failed to fetch offers");

        const data = await res.json();

        setOffers(data || []);
        hasFetchedRef.current = true;

        setTimeout(() => {
          sectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      } catch (err) {
        console.error(err);
        setError("Unable to load offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [visible]);

  useEffect(() => {
    if (visible) setPage(1);
  }, [visible]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!visible) return null;

  const paginatedOffers = offers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div ref={sectionRef} className="mt-20 space-y-12 animate-fadeIn">
      <h2 className="font-serif text-3xl text-center tracking-wide">
        More Exclusive Offers
      </h2>

      {/* ================= Loading ================= */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">
            Fetching premium deals...
          </p>
        </div>
      )}

      {/* ================= Error ================= */}
      {error && (
        <div className="text-center text-red-500 py-10">
          {error}
        </div>
      )}

      {/* ================= Empty ================= */}
      {!loading && !error && offers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No additional offers available right now.
        </div>
      )}

      {/* ================= Offers Grid ================= */}
      {!loading && !error && offers.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {paginatedOffers.map((offer) => (
              <div
                key={offer.id}
                className="relative bg-gradient-to-br from-card to-muted/40 border border-border rounded-3xl p-7 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
              >
                {/* Decorative Glow */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all" />

                {/* Header */}
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div>
                    <h3 className="font-serif text-xl text-foreground">
                      {offer.code}
                    </h3>
                  </div>

                  <div className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    {offer.discount_type === "percent"
                      ? `${offer.discount_value}% OFF`
                      : `₹${offer.discount_value} OFF`}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-muted-foreground mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <Icon name="ShoppingBagIcon" size={16} />
                    <span>Min Order: ₹{offer.min_cart_value || 0}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon name="CalendarDaysIcon" size={16} />
                    <span>
                      Valid until{" "}
                      {new Date(offer.expiry_date).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Copy Section */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex-1 px-4 py-3 border-2 border-dashed border-primary rounded-xl bg-primary/5 font-mono font-semibold">
                    {offer.code}
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Icon name="CheckIcon" size={18} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Icon name="ClipboardDocumentIcon" size={18} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= Pagination ================= */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`w-11 h-11 rounded-full transition-all duration-300 ${
                    page === index + 1
                      ? "bg-primary text-white shadow-lg scale-110"
                      : "bg-card border border-border hover:bg-muted"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoreOffers;