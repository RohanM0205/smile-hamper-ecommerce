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

export async function createCategory(
  name: string,
  parent_id: string | null
) {
  const supabase = await supabaseServer();

  const slug = generateSlug(name);

  /* -----------------------------------------
     Check duplicate under SAME parent
  ------------------------------------------*/
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .eq("parent_id", parent_id)
    .maybeSingle();

  if (existing) {
    throw new Error("Category with same name already exists under this parent");
  }

  /* -----------------------------------------
     Insert
  ------------------------------------------*/
  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    parent_id,
    is_active: true,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}
