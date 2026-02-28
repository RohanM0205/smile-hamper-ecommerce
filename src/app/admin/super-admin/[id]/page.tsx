import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase
    .from("admin_users_view")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!userData) redirect("/admin/super-admin");

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">

<Link
  href="/admin/super-admin"
  className="inline-block mb-4 text-sm text-primary hover:underline"
>
  ← Back to Super Admin Panel
</Link>


      <h1 className="text-2xl font-serif">User Details</h1>

      <div className="bg-card border rounded-xl p-6 space-y-2">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Name:</strong> {userData.full_name ?? "-"}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p>
          <strong>Status:</strong>{" "}
          {userData.banned_until ? (
            <span className="text-red-600">Disabled</span>
          ) : (
            <span className="text-green-600">Active</span>
          )}
        </p>
        <p>
          <strong>Total Orders:</strong> {userData.total_orders}
        </p>
        <p>
          <strong>Total Spent:</strong>{" "}
          ₹{Number(userData.total_spent).toLocaleString()}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(userData.created_at).toLocaleString()}
        </p>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-medium mb-2">Recent Orders</h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders?.map((order) => (
              <tr key={order.id}>
                <td className="p-2">{order.id.slice(0, 8)}</td>
                <td className="p-2">
                  ₹{Number(order.total_amount).toLocaleString()}
                </td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
