"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* ---------------- CREATE ---------------- */
export async function createCategory(
  name: string,
  parent_id: string | null
) {
  const supabase = await supabaseServer();

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    parent_id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
}

/* ---------------- UPDATE ---------------- */
export async function updateCategory(
  id: string,
  name: string,
  parent_id: string | null
) {
  const supabase = await supabaseServer();

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const { error } = await supabase
    .from("categories")
    .update({ name, slug, parent_id })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
}

/* ---------------- DELETE ---------------- */
export async function deleteCategory(id: string) {
  const supabase = await supabaseServer();

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if ((count ?? 0) > 0) {
    throw new Error("Category is in use by products");
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
}

/* ========================================================= */
/* ================= CATEGORY DETAILS ======================= */
/* ========================================================= */

export async function getCategoryDetails(categoryId: string) {
  const supabase = await supabaseServer();

  /* category info */
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, parent_id")
    .eq("id", categoryId)
    .single();

  if (!category) throw new Error("Category not found");

  /* direct children count */
  const { count: subCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", categoryId);

  /* descendant ids using recursive function */
  const { data: descendants } = await supabase.rpc(
    "get_category_descendants",
    { root_id: categoryId }
  );

  const descendantIds =
    descendants?.map((d: any) => d.id) ?? [];

  /* products directly */
  const { count: directProducts } = await supabase
    .from("product_categories")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);

  /* products in subtree */
  const { count: subtreeProducts } = await supabase
    .from("product_categories")
    .select("*", { count: "exact", head: true })
    .in("category_id", [categoryId, ...descendantIds]);

  return {
    category,
    subcategories: subCount ?? 0,
    descendants: descendantIds.length,
    directProducts: directProducts ?? 0,
    subtreeProducts: subtreeProducts ?? 0,
  };
}
