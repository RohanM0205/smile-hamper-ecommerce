"use server";

import { supabaseServer } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";

/* -------------------------------
   INSERT IMAGE (NEW)
-------------------------------- */
export async function insertProductImage(
  productId: string,
  image_url: string,
  public_id: string
) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      image_url,
      cloudinary_public_id: public_id,
    })
    .select("id, image_url, is_primary, sort_order")
    .single();

  if (error) throw error;

  return data;
}

/* -------------------------------
   SET PRIMARY
-------------------------------- */
export async function setPrimaryImage(productId: string, imageId: string) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.rpc("set_primary_product_image", {
    p_product_id: productId,
    p_image_id: imageId,
  });

  if (error) throw error;
}

/* -------------------------------
   REORDER
-------------------------------- */
export async function reorderImages(
  productId: string,
  orders: { id: string; sort_order: number }[]
) {
  const supabase = await supabaseServer();

  await Promise.all(
    orders.map((o) =>
      supabase
        .from("product_images")
        .update({ sort_order: o.sort_order })
        .eq("id", o.id)
        .eq("product_id", productId)
    )
  );
}

/* -------------------------------
   DELETE
-------------------------------- */
export async function deleteImage(imageId: string) {
  const supabase = await supabaseServer();

  const { data: image, error: fetchError } = await supabase
    .from("product_images")
    .select("product_id, is_primary, cloudinary_public_id")
    .eq("id", imageId)
    .single();

  if (fetchError || !image) {
    throw new Error("Image not found");
  }

  /* ---------------------------
     Delete from Cloudinary
  --------------------------- */
  if (image.cloudinary_public_id) {
    try {
      await cloudinary.uploader.destroy(
        image.cloudinary_public_id
      );
    } catch (err) {
      console.error("Cloudinary delete error:", err);
      // Do NOT crash if cloudinary fails
    }
  }

  /* ---------------------------
     Delete DB record
  --------------------------- */
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (deleteError) {
    console.error(deleteError);
    throw new Error(deleteError.message);
  }

  /* ---------------------------
     If primary → set next primary
  --------------------------- */
  if (image.is_primary) {
    const { data: nextImages } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", image.product_id)
      .order("sort_order", { ascending: true })
      .limit(1);

    if (nextImages && nextImages.length > 0) {
      await supabase.rpc("set_primary_product_image", {
        p_product_id: image.product_id,
        p_image_id: nextImages[0].id,
      });
    }
  }
}

