import { supabaseServer } from "@/lib/supabase/server";

export async function getCategoryPath(categoryId: string): Promise<string[]> {
  const supabase = await supabaseServer();

  const path: string[] = [];
  let current = categoryId;

  while (current) {
    const { data } = await supabase
      .from("categories")
      .select("slug, parent_id")
      .eq("id", current)
      .single();

    if (!data) break;

    path.unshift(data.slug);
    current = data.parent_id;
  }

  return path;
}
