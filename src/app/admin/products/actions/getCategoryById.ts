"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getCategoryById(id: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { error: "Category not found" };
  }

  return { data };
}
