import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WishlistClient from "@/app/wishlist/WishlistClient";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: wishlist } = await supabase
    .from("wishlist")
    .select(
      `
      id,
      product_id,
      products (
        id,
        name,
        slug,
        price,
        discount_price,
        stock,
        product_images (
          image_url,
          is_primary,
          sort_order
        )
      )
    `
    )
    .eq("user_id", user.id);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-serif mb-10">
          My Wishlist
        </h1>

        <WishlistClient
          items={wishlist ?? []}
        />
      </main>

      <Footer />
    </>
  );
}
