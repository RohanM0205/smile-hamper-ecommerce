import { supabaseServer } from "@/lib/supabase/server";
import CategoriesClient from "./components/CategoriesClient";

export default async function AdminCategoriesPage() {
  const supabase = await supabaseServer();

  /* categories */
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  /* product counts */
  const { data: counts } = await supabase
    .from("products")
    .select("category_id")
    .not("category_id", "is", null);

  const productCountMap: Record<string, number> = {};

  counts?.forEach((c) => {
    productCountMap[c.category_id] =
      (productCountMap[c.category_id] || 0) + 1;
  });

  return (
    <CategoriesClient
      categories={categories ?? []}
      productCountMap={productCountMap}
    />
  );
}
