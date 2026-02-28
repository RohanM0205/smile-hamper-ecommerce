import { redirect, notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { supabaseServer } from "@/lib/supabase/server";
import OrderHeader from "@/app/profile/orders/components/OrderHeader";
import OrderItems from "@/app/profile/orders/components/OrderItems";
import ShippingDetails from "@/app/profile/orders/components/ShippingDetails";
import PaymentDetails from "@/app/profile/orders/components/PaymentDetails";

export default async function OrderDetails({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  /* ================= FETCH ORDER ================= */

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) notFound();

  /* ================= SECURITY CHECK ================= */

  if (order.user_id !== user.id) {
    redirect("/profile");
  }

  /* ================= FETCH ORDER ITEMS ================= */

  const { data: rawItems } = await supabase
    .from("order_items")
    .select(`
      id,
      price,
      quantity,
      customization,
      products (
        id,
        name,
        slug,
        price,
        discount_price
      )
    `)
    .eq("order_id", order.id);

  /* ================= NORMALIZE PRODUCTS ================= */

  type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
  };

  const getProduct = (
    p: Product | Product[] | null
  ): Product | null =>
    Array.isArray(p) ? p[0] ?? null : p;

  const items =
    (rawItems || []).map((item: any) => ({
      ...item,
      product: getProduct(item.products),
    }));

  /* ================= FETCH SHIPPING SNAPSHOT ================= */

  const { data: shipping } = await supabase
    .from("order_shipping_details")
    .select("*")
    .eq("order_id", order.id)
    .single();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <OrderHeader order={order} />

          <div className="grid lg:grid-cols-2 gap-8">
            <OrderItems items={items} />
            <ShippingDetails shipping={shipping} />
          </div>

          <PaymentDetails order={order} />
        </div>
      </main>

      <Footer />
    </>
  );
}