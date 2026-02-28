import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AdminSidebar from "./components/AdminSidebar";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("LAYOUT USER:", user);


  if (!user) {
    redirect("/login");
  }

  // Fetch profile role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/"); // Block non-admins
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          <AdminSidebar role={profile.role} />
          <div className="flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
