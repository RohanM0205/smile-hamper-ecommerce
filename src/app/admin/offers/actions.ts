"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

/* ================= CREATE ================= */

export async function createCoupon(formData: FormData) {
  const supabase = await supabaseServer();

  const code = formData.get("code")?.toString().toUpperCase();
  const discount_type = formData.get("discount_type");
  const discount_value = Number(formData.get("discount_value"));
  const min_cart_value = Number(formData.get("min_cart_value")) || null;
  const expiry_date = formData.get("expiry_date") || null;
  const usage_limit = Number(formData.get("usage_limit")) || null;
  const per_user_limit = Number(formData.get("per_user_limit")) || 1;

  const { error } = await supabase.from("coupons").insert({
    code,
    discount_type,
    discount_value,
    min_cart_value,
    expiry_date,
    usage_limit,
    per_user_limit,
    is_active: true,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/offers");
}

/* ================= UPDATE ================= */

export async function updateCoupon(id: string, formData: FormData) {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("coupons")
    .update({
      code: formData.get("code")?.toString().toUpperCase(),
      discount_type: formData.get("discount_type"),
      discount_value: Number(formData.get("discount_value")),
      min_cart_value:
        Number(formData.get("min_cart_value")) || null,
      expiry_date: formData.get("expiry_date") || null,
      usage_limit:
        Number(formData.get("usage_limit")) || null,
      per_user_limit:
        Number(formData.get("per_user_limit")) || 1,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/offers");
}

/* ================= TOGGLE ACTIVE ================= */

export async function toggleCoupon(id: string, active: boolean) {
  const supabase = await supabaseServer();

  await supabase
    .from("coupons")
    .update({ is_active: !active })
    .eq("id", id);

  revalidatePath("/admin/offers");
}

/* ================= SOFT DELETE ================= */

export async function deleteCoupon(id: string) {
  const supabase = await supabaseServer();

  await supabase
    .from("coupons")
    .update({ is_active: false })
    .eq("id", id);

  revalidatePath("/admin/offers");
}