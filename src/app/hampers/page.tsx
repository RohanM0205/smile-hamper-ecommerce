import Hero from "./components/Hero";
import FeaturedHampers from "./components/FeaturedHampers";
import HampersClient from "./components/HampersClient";
import { supabaseServer } from "@/lib/supabase/server";
import Footer from "@/components/common/Footer";
import HamperSearch from "./components/HamperSearch";

export const revalidate = 120;

/* =====================================================
   SHARED TYPE (Matches ProductCard)
===================================================== */

export type HamperGridItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  tags: string[] | null;
  image: string;
  product_images: {
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }[];
};

export default async function HampersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;

  const activeFilter = resolvedParams?.filter || "all";
  const searchQuery = resolvedParams?.search || "";

  const supabase = await supabaseServer();

  /* =====================================================
     1️⃣ GET HAMPERS CATEGORY
  ===================================================== */

  const { data: hampersCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "hampers")
    .eq("is_active", true)
    .single();

  if (!hampersCategory) {
    return <div className="pt-20 text-center">Category not found.</div>;
  }

  /* =====================================================
     2️⃣ GET ALL PRODUCTS UNDER HAMPERS
  ===================================================== */

  const { data: hampersRelations } = await supabase
    .from("product_categories")
    .select("product_id")
    .eq("category_id", hampersCategory.id);

  const hampersProductIds =
    hampersRelations?.map((r) => r.product_id) ?? [];

  if (hampersProductIds.length === 0) {
    return <div className="pt-20 text-center">No hampers found.</div>;
  }

  const { data: allProducts } = await supabase
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
    .in("id", hampersProductIds)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const allHampers: HamperGridItem[] =
    allProducts?.map((product: any) => {
      const productImages = product.product_images ?? [];
      const primaryImage =
        productImages.find((img: { is_primary: boolean }) => img.is_primary)
          ?.image_url ?? productImages[0]?.image_url ?? "";

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        discount_price:
          product.discount_price != null
            ? Number(product.discount_price)
            : null,
        tags: product.tags ?? null,
        image: primaryImage,
        product_images: productImages,
      };
    }) ?? [];

  /* =====================================================
     3️⃣ SEARCH FILTER (Server Side)
  ===================================================== */

  let searchableHampers = allHampers;

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();

    searchableHampers = allHampers.filter((hamper) =>
      hamper.name.toLowerCase().includes(lowerQuery) ||
      hamper.tags?.some((tag) =>
        tag.toLowerCase().includes(lowerQuery)
      )
    );
  }

  /* =====================================================
     4️⃣ CATEGORY FILTER (Parent + Children Logic)
  ===================================================== */

  let filteredHampers = searchableHampers;

  if (activeFilter !== "all") {
    const { data: selectedCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", activeFilter)
      .eq("is_active", true)
      .single();

    if (selectedCategory) {
      const { data: childCategories } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_id", selectedCategory.id)
        .eq("is_active", true);

      const filterCategoryIds = [
        selectedCategory.id,
        ...(childCategories?.map((c) => c.id) ?? []),
      ];

      const { data: filterRelations } = await supabase
        .from("product_categories")
        .select("product_id")
        .in("category_id", filterCategoryIds);

      const filterProductIds =
        filterRelations?.map((r) => r.product_id) ?? [];

      const validProductIds = hampersProductIds.filter((id) =>
        filterProductIds.includes(id)
      );

      filteredHampers = searchableHampers.filter((p) =>
        validProductIds.includes(p.id)
      );
    }
  }

  /* =====================================================
     5️⃣ RENDER
  ===================================================== */

  return (
    <>
      <div className="pt-20">

        {/* Static Sections */}
        <Hero featuredHamper={allHampers[6] ?? null} />
        <FeaturedHampers hampers={allHampers.slice(0, 5)} />

        {/* 🔎 Search Bar */}
        <HamperSearch />

        {/* Search Info */}
        {searchQuery && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
            <p className="text-sm text-muted-foreground">
              Showing results for{" "}
              <span className="font-medium text-foreground">
                "{searchQuery}"
              </span>
            </p>
          </div>
        )}

        {/* Dynamic Grid */}
        <HampersClient hampers={filteredHampers} />
      </div>

      <Footer />
    </>
  );
}