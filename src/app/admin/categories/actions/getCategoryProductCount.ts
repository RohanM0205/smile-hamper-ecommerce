"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getCategoryProductCount(categoryId: string) {
  const supabase = await supabaseServer();

  const { count, error } = await supabase
    .from("product_categories")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (error) throw new Error(error.message);

  return count ?? 0;
}
