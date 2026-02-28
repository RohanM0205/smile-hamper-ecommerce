export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  console.log("🟡 AdminOrderDetailsPage invoked");

  // 1️⃣ Log params
  const resolvedParams = await params;
  console.log("🟡 params resolved:", resolvedParams);

  const orderId = resolvedParams?.id;
  console.log("🟡 orderId:", orderId);

  if (!orderId) {
    console.error("🔴 orderId is missing");
    return <div>Invalid Order ID</div>;
  }

  // 2️⃣ Init Supabase
  const supabase = await supabaseServer();
  console.log("🟡 Supabase client created");

  // 3️⃣ Fetch order
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_amount,
      created_at,
      order_items (
        id,
        quantity,
        price,
        product_id,
        product:products (
          name
        )
      )
    `)
    .eq("id", orderId)
    .single();

  console.log("🟡 Supabase response error:", error);
  console.log("🟡 Supabase response order:", order);

  if (error) {
    console.error("🔴 Supabase error:", error);
    return <div>Failed to load order</div>;
  }

  if (!order) {
    console.error("🔴 Order is null");
    return <div>Order not found</div>;
  }

  console.log(
    "🟢 order_items length:",
    order.order_items ? order.order_items.length : "undefined"
  );

  return (
    <div className="p-8 space-y-6">
      <Link href="/admin/orders" className="text-sm underline">
        ← Back to Orders
      </Link>

      <h1 className="text-2xl font-serif">
        Order #{order.id}
      </h1>

      <div className="space-y-2">
        <p>Status: {order.status}</p>
        <p>Total: ₹{order.total_amount}</p>
        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
      </div>

      <div>
        <h2 className="font-medium mb-2">Items</h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-center">Price</th>
            </tr>
          </thead>

          <tbody>
            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map((item: any) => (
                <tr key={item.id}>
                  <td className="p-2">
                    {item.product?.name ?? "NO PRODUCT"}
                  </td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">₹{item.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-red-500">
                  No items found (DEBUG)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
