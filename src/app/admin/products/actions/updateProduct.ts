"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* ----------------------------------
   Customization Field Interface
----------------------------------- */
interface CustomizationFieldInput {
  field_type: "text" | "image";
  label: string;
  max_length?: number | null;
  sort_order: number;
}

/* ----------------------------------
   Update Product Input
----------------------------------- */
interface UpdateProductInput {
  name?: string;
  description?: string | null;
  price?: number;
  discount_price?: number | null;
  stock?: number;
  is_active?: boolean;
  category_id?: string | null;
  tags?: string[] | null;

  allow_customization?: boolean;
  customization_fields?: CustomizationFieldInput[];
}

/* ----------------------------------
   MAIN UPDATE FUNCTION
----------------------------------- */
export async function updateProduct(
  id: string,
  data: UpdateProductInput
) {
  const supabase = await supabaseServer();

  /* -----------------------------
     Validate Category (if provided)
  ------------------------------*/
  if (data.category_id !== undefined && data.category_id !== null) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("id", data.category_id)
      .single();

    if (!cat) {
      throw new Error("Invalid category id");
    }
  }

  /* -----------------------------
     Build SAFE Update Payload
     (Only update provided fields)
  ------------------------------*/
  const updatePayload: any = {};

  if (data.name !== undefined) {
    updatePayload.name = data.name;
    updatePayload.slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  if (data.description !== undefined) {
    updatePayload.description = data.description;
  }

  if (data.price !== undefined) {
    updatePayload.price = data.price;
  }

  if (data.discount_price !== undefined) {
    updatePayload.discount_price = data.discount_price;
  }

  if (data.stock !== undefined) {
    updatePayload.stock = data.stock;
  }

  if (data.category_id !== undefined) {
    updatePayload.category_id = data.category_id;
  }

  if (data.is_active !== undefined) {
    updatePayload.is_active = data.is_active;
  }

  if (data.tags !== undefined) {
    updatePayload.tags =
      data.tags && data.tags.length > 0
        ? data.tags
        : null;
  }

  if (data.allow_customization !== undefined) {
    updatePayload.allow_customization =
      data.allow_customization;
  }

  /* -----------------------------
     1️⃣ Update Product Table
  ------------------------------*/
  if (Object.keys(updatePayload).length > 0) {
    const { error } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("Update product error:", error);
      throw new Error(error.message);
    }
  }

  /* -----------------------------
     2️⃣ Handle Customization Fields
     (Only if explicitly provided)
  ------------------------------*/
  if (data.customization_fields !== undefined) {
    // Delete existing fields first
    const { error: deleteError } = await supabase
      .from("product_customization_fields")
      .delete()
      .eq("product_id", id);

    if (deleteError) {
      console.error("Delete customization error:", deleteError);
      throw new Error("Failed to reset customization fields");
    }

    // Insert new ones (if allowed + provided)
    if (
      data.allow_customization &&
      data.customization_fields.length > 0
    ) {
      const fieldsPayload = data.customization_fields.map(
        (field) => ({
          product_id: id,
          field_type: field.field_type,
          label: field.label,
          max_length: field.max_length ?? null,
          sort_order: field.sort_order,
        })
      );

      const { error: insertError } = await supabase
        .from("product_customization_fields")
        .insert(fieldsPayload);

      if (insertError) {
        console.error(
          "Insert customization error:",
          insertError
        );
        throw new Error(
          "Failed to save customization fields"
        );
      }
    }
  }

  /* -----------------------------
     Revalidate Admin Page
  ------------------------------*/
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/admin/products");
}
