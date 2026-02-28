"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProductCategories(
  productId: string,
  categoryIds: string[]
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  /* -------------------------
     1. Delete existing
  -------------------------- */
  const { error: deleteError } = await supabase
    .from("product_categories")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Failed to clear old categories");
  }

  /* -------------------------
     2. Insert new
  -------------------------- */
  if (categoryIds.length > 0) {
    const payload = categoryIds.map((cid) => ({
      product_id: productId,
      category_id: cid,
    }));

    const { error: insertError } = await supabase
      .from("product_categories")
      .insert(payload);

    if (insertError) {
      console.error(insertError);
      throw new Error("Failed to update categories");
    }
  }

  revalidatePath(`/admin/products/${productId}`);
}
