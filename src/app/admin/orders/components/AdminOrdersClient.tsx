"use client";

import Icon from "@/components/ui/AppIcon";
import Link from "next/link";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-primary/10 text-primary";
      case "shipped":
        return "bg-warning/10 text-warning";
      case "delivered":
        return "bg-success/10 text-success";
      case "cancelled":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h1 className="font-serif text-3xl">Orders</h1>

        <input
          placeholder="Search orders..."
          className="px-4 py-2 border border-border rounded-xl bg-background"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-border hover:bg-muted/30"
              >
                <td className="px-6 py-4 font-mono">
                  #{order.id.slice(0, 8)}
                </td>

                <td className="px-6 py-4">
                  {order.profiles?.full_name ?? "—"}
                </td>

                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                </td>

                <td className="px-6 py-4 font-serif">
                  ₹{order.total_amount.toLocaleString("en-IN")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* FIXED ACTION */}
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    <Icon name="EyeIcon" size={18} />
                  </Link>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
