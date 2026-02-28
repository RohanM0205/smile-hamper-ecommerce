import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductGrid from "@/app/products/components/ProductGrid";
import { supabaseServer } from "@/lib/supabase/server";
import SubCategoryChips from "./SubCategoryChips";
import OccasionHero from "./OccasionHero";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  params: { slug: string };
  searchParams: {
    sub?: string;
    page?: string;
  };
}

const PAGE_SIZE = 9;

export default async function OccasionPage({
  params,
  searchParams,
}: Props) {
  const { slug } = params;
  const { sub, page = "1" } = searchParams;

  const currentPage = parseInt(page);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await supabaseServer();

  /* ---------------- GET PARENT ---------------- */

  const { data: parent } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!parent) return notFound();

  /* ---------------- GET SUBCATEGORIES ---------------- */

  const { data: subCategories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("parent_id", parent.id)
    .eq("is_active", true);

  const typedSubCategories: Category[] = subCategories ?? [];

  /* ---------------- ACTIVE CATEGORY IDS ---------------- */

  let activeCategoryIds: string[] = [];

  if (sub) {
    const selected = typedSubCategories.find(
      (c) => c.slug === sub
    );
    if (selected) activeCategoryIds = [selected.id];
  } else {
    activeCategoryIds = [
      parent.id,
      ...typedSubCategories.map((c) => c.id),
    ];
  }

  /* ---------------- GET PRODUCT IDS ---------------- */

  const { data: relations } = await supabase
    .from("product_categories")
    .select("product_id")
    .in("category_id", activeCategoryIds);

  const relationIds =
    relations?.map((r) => r.product_id) ?? [];

  const { data: directProducts } = await supabase
    .from("products")
    .select("id")
    .in("category_id", activeCategoryIds);

  const directIds =
    directProducts?.map((p) => p.id) ?? [];

  const productIds = [...new Set([...relationIds, ...directIds])];

  /* ---------------- FETCH PRODUCTS ---------------- */

  let products: Product[] = [];
  let count: number = 0;

  if (productIds.length > 0) {
    const response = await supabase
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
        `,
        { count: "exact" }
      )
      .in("id", productIds)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    products = (response.data as Product[]) ?? [];
    count = response.count ?? 0;
  }

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-rose-50/30 via-white to-white min-h-screen">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

          {/* Hero */}
          <OccasionHero title={parent.name} />

          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground/70 text-center">
            <span className="hover:text-primary transition cursor-pointer">
              Home
            </span>
            <span className="mx-2">/</span>
            <span className="hover:text-primary transition cursor-pointer">
              Occasions
            </span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">
              {parent.name}
            </span>
          </div>

          {/* Category Section */}
          <section className="space-y-6 text-center">

            <h2 className="text-lg font-serif tracking-wide">
              Explore by Category
            </h2>

            <div className="bg-white/80 backdrop-blur-sm border border-border/30 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
              <SubCategoryChips
                occasionSlug={slug}
                categories={typedSubCategories}
                activeSlug={sub}
              />
            </div>

          </section>

          {/* Product Section */}
          <section className="space-y-8">

            {products.length > 0 ? (
              <ProductGrid
                products={products}
                totalCount={count}
              />
            ) : (
              <div className="text-center py-16 space-y-3">
                <h3 className="text-lg font-semibold">
                  No gifts found
                </h3>
                <p className="text-muted-foreground">
                  We’re currently curating beautiful hampers for this category.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">

                {currentPage > 1 && (
                  <a
                    href={`/occasions/${slug}?${sub ? `sub=${sub}&` : ""}page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-full border border-border hover:bg-rose-50 transition"
                  >
                    Previous
                  </a>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <a
                      key={p}
                      href={`/occasions/${slug}?${sub ? `sub=${sub}&` : ""}page=${p}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition border ${
                        p === currentPage
                          ? "bg-rose-500 text-white border-rose-500 shadow"
                          : "border-border hover:bg-rose-50"
                      }`}
                    >
                      {p}
                    </a>
                  )
                )}

                {currentPage < totalPages && (
                  <a
                    href={`/occasions/${slug}?${sub ? `sub=${sub}&` : ""}page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-full border border-border hover:bg-rose-50 transition"
                  >
                    Next
                  </a>
                )}

              </div>
            )}

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}
