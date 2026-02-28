"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function updateCategory(
  id: string,
  name: string,
  parent_id: string | null
) {
  const supabase = await supabaseServer();

  /* -----------------------------------------
     CYCLIC CATEGORY PROTECTION
     Prevent:
     A → B → C → A
  ------------------------------------------*/
  if (parent_id) {
    let currentParent = parent_id;

    while (currentParent) {
      if (currentParent === id) {
        throw new Error("Invalid category hierarchy (cyclic parent)");
      }

      const { data } = await supabase
        .from("categories")
        .select("parent_id")
        .eq("id", currentParent)
        .single();

      currentParent = data?.parent_id ?? null;
    }
  }

  /* -----------------------------------------
     Duplicate slug check (same parent)
  ------------------------------------------*/
  const slug = generateSlug(name);

  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .eq("parent_id", parent_id)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    throw new Error("Category with same name already exists under this parent");
  }

  /* -----------------------------------------
     Update
  ------------------------------------------*/
  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      parent_id,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
revalidatePath("/shop"); 
revalidatePath("/products"); 

}
