import { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import AdminProductsClient from "./components/AdminProductsClient";

export const metadata: Metadata = {
  title: "Admin Products - TheSmileHamper",
};

const PAGE_SIZE = 20;

/* ---------- UUID CHECK ---------- */
function isUUID(value: string) {
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    minStock?: string;
    maxStock?: string;
  }>;
}) {
  /* ---------- VERY IMPORTANT (NextJS 15 FIX) ---------- */
  const params = await searchParams;

  const supabase = await supabaseServer();

  const page = Number(params.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const status = params.status ?? "";
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const minStock = params.minStock;
  const maxStock = params.maxStock;

  let productsQuery = supabase
    .from("products")
    .select(
      `
        id,
        name,
        description,
        price,
        discount_price,
        stock,
        is_active,
        category_id,
        category:categories!products_category_id_fkey (
          name
        ),
        product_images (
          image_url,
          is_primary
        )
      `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  /* ---------- SEARCH ---------- */
  if (search) {
    if (isUUID(search)) {
      productsQuery = productsQuery.or(
        `name.ilike.%${search}%,id.eq.${search}`
      );
    } else {
      productsQuery = productsQuery.ilike("name", `%${search}%`);
    }
  }

  /* ---------- CATEGORY FILTER ---------- */
  if (category) {
    if (isUUID(category)) {
      productsQuery = productsQuery.eq("category_id", category);
    } else {
      productsQuery = productsQuery.ilike(
        "category.name",
        `%${category}%`
      );
    }
  }

  /* ---------- STATUS ---------- */
  if (status === "active") {
    productsQuery = productsQuery.eq("is_active", true);
  }
  if (status === "inactive") {
    productsQuery = productsQuery.eq("is_active", false);
  }

  /* ---------- PRICE ---------- */
  if (minPrice) productsQuery = productsQuery.gte("price", Number(minPrice));
  if (maxPrice) productsQuery = productsQuery.lte("price", Number(maxPrice));

  /* ---------- STOCK ---------- */
  if (minStock) productsQuery = productsQuery.gte("stock", Number(minStock));
  if (maxStock) productsQuery = productsQuery.lte("stock", Number(maxStock));

  /* ---------- Pagination ---------- */
  productsQuery = productsQuery.range(offset, offset + PAGE_SIZE - 1);

  const [
    { data: { user } },
    { data: categories },
    { data: products, count, error },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("categories").select("id, name").order("name"),
    productsQuery,
  ]);

  if (error) {
    console.error("AdminProducts error:", error.message);
  }

  const normalizedProducts =
    products?.map((p) => {
      const categoryObj = Array.isArray(p.category)
        ? p.category[0]
        : p.category;

      return {
        ...p,
        primaryImage:
          p.product_images?.find((img) => img.is_primary)?.image_url ?? null,
        categoryName: categoryObj?.name ?? "-",
      };
    }) ?? [];

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <AdminProductsClient
      products={normalizedProducts}
      categories={categories ?? []}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
