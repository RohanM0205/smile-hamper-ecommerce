import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import ProductCard from "../../products/components/ProductCard";

interface ProductImage {
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  tags: string[] | null;
  product_images: ProductImage[];
}

export default async function MostLoved() {
  /* -------------------------
     FETCH 3 BEST SELLERS
  -------------------------- */

  const supabase = await supabaseServer();

  const { data: products } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        price,
        discount_price,
        tags,
        product_images (
          image_url,
          is_primary,
          sort_order
        )
      `
    )
    .contains("tags", ["best_seller"])
    .limit(3);

  if (!products || products.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-sand-100 to-background">
      
      {/* Glow Background */}
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-[160px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[180px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">

          <p className="text-xs tracking-[0.35em] uppercase text-primary font-medium">
            Curated Selection
          </p>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">
            Most <span className="italic text-primary">Loved</span>
          </h2>

          <div className="w-16 h-[2px] bg-primary mx-auto" />

          <p className="text-muted-foreground font-light leading-relaxed">
            Handpicked favorites cherished by our customers — 
            elegant, thoughtful, and unforgettable.
          </p>
        </div>

        {/* Product Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {products.map((product: Product) => (
            <div
              key={product.id}
              className="
                group relative rounded-3xl 
                bg-card/60 backdrop-blur-md 
                border border-border 
                p-6 
                shadow-md
                transition-all duration-500
                hover:shadow-2xl 
                hover:-translate-y-3
              "
            >
              {/* subtle glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

              <div className="relative z-10">
                <ProductCard product={product} />
              </div>
            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/products?quick=best_seller&page=1"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <span className="relative flex items-center gap-2">
              Explore All Best Sellers
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}