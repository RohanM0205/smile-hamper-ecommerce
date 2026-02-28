"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Hamper {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  image: string;
}

export default function Hero({
  featuredHamper,
}: {
  featuredHamper: Hamper | null;
}) {
  const router = useRouter();

  const handleRedirect = () => {
    if (!featuredHamper?.slug) return;
    router.push(`/products/${encodeURIComponent(featuredHamper.slug)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground">
            Curated Hampers Crafted to <span className="text-primary">Impress</span>
          </h1>

          <p className="text-lg text-foreground/70 max-w-xl">
            Thoughtfully handpicked gifts, elegantly packed, and delivered with love —
            for every celebration that truly matters.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#hamper-grid"
              className="px-8 py-4 bg-primary text-white rounded-full font-medium text-base hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Explore Hampers
            </Link>

            <Link
              href="/hampers/build"
              className="px-8 py-4 bg-white border border-primary/30 text-primary rounded-full font-medium text-base hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Build Your Own Hamper
            </Link>
          </div>

          <p className="text-lg text-foreground/70 max-w-xl">
          Warning: May cause spontaneous smiles and unexpected hugs.
          </p>
        </div>

        {/* Right Featured Hamper */}
        {featuredHamper && (
          <div className="relative group cursor-pointer" onClick={handleRedirect}>
            
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
              
              <Image
                src={featuredHamper.image}
                alt={featuredHamper.name}
                width={600}
                height={600}
                className="w-full h-[450px] object-cover group-hover:scale-105 transition duration-700"
                priority
              />

              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 text-white">
                <h3 className="text-xl font-semibold">
                  {featuredHamper.name}
                </h3>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-lg font-bold">
                    ₹{featuredHamper.discount_price ?? featuredHamper.price}
                  </span>

                  {featuredHamper.discount_price && (
                    <span className="line-through text-sm opacity-70">
                      ₹{featuredHamper.price}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}