import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SuperAdminClient from "./components/SuperAdminClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 5;

export default async function SuperAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
  }>;
}) {
  /* ==============================
     ✅ Await searchParams (Next 15 Fix)
  ============================== */
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const search = params.search ?? "";
  const roleFilter = params.role ?? "";

  const supabase = await supabaseServer();

  /* ==============================
     Auth Check
  ============================== */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "super_admin") {
    redirect("/admin");
  }

  /* ==============================
     Pagination
  ============================== */
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("admin_users_view")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.ilike("email", `%${search}%`);
  }

  if (roleFilter) {
    query = query.eq("role", roleFilter);
  }

  const { data: users, count } = await query;

  const totalPages = Math.max(Math.ceil((count ?? 0) / PAGE_SIZE), 1);

  return (
    <SuperAdminClient
      users={users ?? []}
      page={page}
      totalPages={totalPages}
      search={search}
      roleFilter={roleFilter}
    />
  );
}
