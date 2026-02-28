// src/app/admin/products/actions/deleteProduct.ts
"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  const supabase = await supabaseServer();

  await supabase.from("product_images").delete().eq("product_id", id);
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
}
