"use client";

import { useRouter } from "next/navigation";

interface Props {
  orders: any[];
}

export default function OrdersTab({ orders }: Props) {
  const router = useRouter();

  if (!orders.length) {
    return (
      <p className="text-muted-foreground">
        No orders yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-3xl mb-4">
        Order History
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() =>
            router.push(`/profile/orders/${order.id}`)
          }
          className="bg-card border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition"
        >
          <div className="flex justify-between mb-2">
            <span className="font-mono font-semibold">
              #{order.id.slice(0, 8)}
            </span>
            <span className="text-sm capitalize">
              {order.status}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {order.order_items?.[0]?.count || 0} items • ₹
            {order.total_amount}
          </p>
        </div>
      ))}
    </div>
  );
}