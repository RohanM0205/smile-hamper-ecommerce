"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/* =====================================================
   🔐 COMMON SUPER ADMIN VERIFICATION (SESSION BASED)
===================================================== */
async function verifySuperAdmin() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Unable to verify permissions.");
  }

  if (profile.role !== "super_admin") {
    throw new Error("Unauthorized action.");
  }

  return { currentUser: user };
}

/* =====================================================
   🔁 UPDATE USER ROLE (SUPER ADMIN ONLY)
===================================================== */
export async function updateUserRole(formData: FormData) {
  const { currentUser } = await verifySuperAdmin();

  const supabase = await supabaseServer();

  const targetUserId = formData.get("userId") as string;
  const newRole = formData.get("newRole") as string;

  if (!targetUserId || !newRole) {
    throw new Error("Invalid request.");
  }

  const allowedRoles = ["user", "admin"];
  if (!allowedRoles.includes(newRole)) {
    throw new Error("Invalid role selected.");
  }

  if (currentUser.id === targetUserId) {
    throw new Error("You cannot change your own role.");
  }

  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetUserId)
    .maybeSingle();

  if (targetProfile?.role === "super_admin") {
    throw new Error("Cannot modify another super admin.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role: newRole,
      updated_at: new Date().toISOString(),
    })
    .eq("id", targetUserId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/super-admin");
}

/* =====================================================
   🚫 ENABLE / DISABLE USER (REAL AUTH BAN)
===================================================== */
export async function toggleUserStatus(formData: FormData) {
  const { currentUser } = await verifySuperAdmin();

  const targetUserId = formData.get("userId") as string;
  const currentStatus = formData.get("currentStatus") as string | null;

  if (!targetUserId) {
    throw new Error("Invalid request.");
  }

  if (currentUser.id === targetUserId) {
    throw new Error("You cannot disable yourself.");
  }

  const supabase = await supabaseServer();

  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetUserId)
    .maybeSingle();

  if (targetProfile?.role === "super_admin") {
    throw new Error("Cannot disable another super admin.");
  }

  /* ==============================
     🔥 USE SERVICE ROLE CLIENT
  ============================== */

  const adminClient = supabaseAdmin();

  const isCurrentlyDisabled = currentStatus && currentStatus !== "";

  const updatePayload = isCurrentlyDisabled
    ? { ban_duration: "none" } // Enable
    : { ban_duration: "8760h" }; // Disable 1 year (8760 hours)

  const { error } = await adminClient.auth.admin.updateUserById(
    targetUserId,
    updatePayload
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/super-admin");
}
