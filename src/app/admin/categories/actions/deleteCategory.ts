"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCategory(id: string) {
  const supabase = await supabaseServer();

  /* Check children */
  const { count: childrenCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", id);

  if (childrenCount && childrenCount > 0) {
    throw new Error(
      "Cannot delete this category because it contains sub-categories."
    );
  }

  /* Check products */
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (productCount && productCount > 0) {
    throw new Error(
      "Cannot delete this category because products are assigned to it."
    );
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete category");
  }

  revalidatePath("/admin/categories");
}
