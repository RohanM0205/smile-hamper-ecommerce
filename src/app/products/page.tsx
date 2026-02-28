import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { supabaseServer } from "@/lib/supabase/server";
import ProductGrid from "@/app/products/components/ProductGrid";
import ProductSearch from "@/app/products/components/ProductSearch";
import ForYouSection from "@/app/products/components/ForYouSection";
import QuickFilterTabs from "@/app/products/components/QuickFilterTabs";
import BestsellerSpotlight from "@/app/products/components/BestsellerSpotlight";
import RecentlyViewed from "@/app/products/components/RecentlyViewed";
import WhyChooseUs from "@/app/products/components/WhyChooseUs";


export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    min?: string;
    max?: string;
    category?: string;
    search?: string;
    quick?: string;   // ✅ Added
  }>;
}

export const metadata: Metadata = {
  title: "Shop Gift Hampers - TheSmileHamper",
  description: "Browse our collection of premium gift hampers.",
};

const PAGE_SIZE = 9;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const {
    page = "1",
    sort = "newest",
    min,
    max,
    category,
    search,
    quick = "all",   // ✅ Added
  } = await searchParams;

  const currentPage = parseInt(page);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await supabaseServer();

  let query = supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      discount_price,
      category_id,
      description,
      tags,
      created_at,
      product_images (
        image_url,
        is_primary,
        sort_order
      )
    `,
      { count: "exact" }
    )
    .eq("is_active", true);


    const { data: bestSellers } = await supabase
    .from("products")
    .select(`
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
    `)
    .eq("is_active", true)
    .contains("tags", ["best_seller"])
    .limit(6);
  


  /* -------------------------------------------------
     🔎 SEARCH
  ------------------------------------------------- */
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  /* -------------------------------------------------
     💰 MANUAL PRICE FILTER
  ------------------------------------------------- */
  if (min) query = query.gte("price", parseInt(min));
  if (max) query = query.lte("price", parseInt(max));

  /* -------------------------------------------------
     📂 CATEGORY FILTER (slug based)
  ------------------------------------------------- */
  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();

    if (categoryData) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  /* -------------------------------------------------
     ⚡ QUICK FILTER LOGIC
  ------------------------------------------------- */

  // For Her / For Him (via product_categories)
  if (quick === "her" || quick === "him") {
    const categoryId =
      quick === "her"
        ? "7dc6d6eb-601d-4bca-ba6a-4cd22f49225a"
        : "736aced6-472e-49cf-b301-50f43c5e1365";

    const { data: relationData } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", categoryId);

    const productIds =
      relationData?.map((r) => r.product_id) ?? [];

    // Prevent empty IN() error
    query = query.in(
      "id",
      productIds.length
        ? productIds
        : ["00000000-0000-0000-0000-000000000000"]
    );
  }

  // Under 1999
  if (quick === "budget") {
    query = query.lt("price", 1999);
  }

  // Premium
  if (quick === "premium") {
    query = query.gte("price", 1999);
  }

  // New Arrivals (tags array)
  if (quick === "new") {
    query = query.contains("tags", ["new"]);
  }
/* ---------------- TAG FILTERS ---------------- */

if (quick === "trending") {
  query = query.contains("tags", ["trending"]);
}

if (quick === "best_seller") {
  query = query.contains("tags", ["best_seller"]);
}

if (quick === "sale") {
  query = query.contains("tags", ["sale"]);
}

if (quick === "featured") {
  query = query.contains("tags", ["featured"]);
}
  /* -------------------------------------------------
     🔃 SORTING
  ------------------------------------------------- */
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  /* -------------------------------------------------
     📄 PAGINATION
  ------------------------------------------------- */
  query = query.range(from, to);

  let { data: products, count } = await query;

  /* -------------------------------------------------
     🔁 FALLBACK SEARCH (description based)
  ------------------------------------------------- */
  if ((!products || products.length === 0) && search) {
    const { data: fallback } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        discount_price,
        category_id,
        description,
        tags,
        created_at,
        product_images (
          image_url,
          is_primary,
          sort_order
        )
      `
      )
      .ilike("description", `%${search}%`)
      .limit(6);

    products = fallback;
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto py-16 px-4 space-y-8">
  <ProductSearch />
  <ForYouSection />
  <BestsellerSpotlight products={bestSellers ?? []} />
  <QuickFilterTabs />
  {/* Products Grid */}
  <div id="products-grid" className="scroll-mt-32">
    <ProductGrid
      products={products ?? []}
      totalCount={count ?? 0}
    />
  </div>
  <RecentlyViewed />
  <WhyChooseUs />
</main>


      <Footer />
    </>
  );
}
