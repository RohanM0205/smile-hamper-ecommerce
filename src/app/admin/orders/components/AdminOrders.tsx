import { supabaseServer } from "@/lib/supabase/server";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrders() {
  const supabase = await supabaseServer();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_amount,
      created_at,
      profiles (
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("AdminOrders error:", error.message);
  }

  const raw = orders ?? [];
  const normalizedOrders = raw.map((order) => ({
    id: order.id,
    status: order.status,
    total_amount: order.total_amount,
    created_at: order.created_at,
    profiles: Array.isArray(order.profiles)
      ? order.profiles[0] ?? null
      : order.profiles ?? null,
  }));

  return <AdminOrdersClient orders={normalizedOrders} />;
}
