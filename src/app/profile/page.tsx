import { redirect } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProfileLayout from "@/app/profile/components/ProfileLayout";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Profile() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  /* ================= FETCH PROFILE ROLE ================= */

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  /* ================= FETCH ORDERS ================= */

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_amount,
      order_items(count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-4xl mb-8">My Account</h1>

          <ProfileLayout
            user={user}
            role={profile?.role || "user"}
            orders={orders || []}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}