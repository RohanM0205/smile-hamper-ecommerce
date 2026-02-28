"use server";

import { supabaseServer } from "@/lib/supabase/server";

interface ProductImageInput {
  image_url: string;
  is_primary?: boolean;
}

interface CustomizationFieldInput {
  field_type: "text" | "image";
  label: string;
  max_length?: number | null;
  sort_order: number;
}

interface CreateProductInput {
  name: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  stock: number;
  category_id?: string | null;
  is_active: boolean;
  tags?: string[] | null; // ✅ added
  images?: ProductImageInput[];
  allow_customization?: boolean;
  customization_fields?: CustomizationFieldInput[];
}

export async function createProduct(input: CreateProductInput) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  /* -----------------------------
     Validate Category
  ------------------------------*/
  if (input.category_id) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("id", input.category_id)
      .single();

    if (!cat) {
      throw new Error("Invalid category id");
    }
  }

  /* -----------------------------
     1. Create product
  ------------------------------*/
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug: input.name.toLowerCase().replace(/\s+/g, "-"),
      description: input.description ?? null,
      price: input.price,
      discount_price: input.discount_price ?? null,
      stock: input.stock,
      category_id: input.category_id ?? null,
      is_active: input.is_active,
      tags: input.tags ?? null, // ✅ added
      created_by: user.id,
      allow_customization: input.allow_customization ?? false,
    })
    .select()
    .single();

  if (error || !product) {
    console.error(error);
    throw new Error("Failed to create product");
  }

  /* -----------------------------
     2. Insert product images
  ------------------------------*/
  if (input.images?.length) {
    const imagesPayload = input.images.map((img, index) => ({
      product_id: product.id,
      image_url: img.image_url,
      is_primary: img.is_primary ?? index === 0,
    }));

    const { error: imageError } = await supabase
      .from("product_images")
      .insert(imagesPayload);

    if (imageError) {
      console.error(imageError);
      throw new Error("Failed to save product images");
    }
  }

  /* -----------------------------
   3. Insert Customization Fields
------------------------------*/
if (input.allow_customization && input.customization_fields?.length) {
  const fieldsPayload = input.customization_fields.map((field) => ({
    product_id: product.id,
    field_type: field.field_type,
    label: field.label,
    max_length: field.max_length ?? null,
    sort_order: field.sort_order,
  }));

  const { error: customError } = await supabase
    .from("product_customization_fields")
    .insert(fieldsPayload);

  if (customError) {
    console.error(customError);
    throw new Error("Failed to save customization fields");
  }
}


  return product;
}
