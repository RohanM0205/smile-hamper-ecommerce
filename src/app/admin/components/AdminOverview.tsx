"use client";

import Icon from "@/components/ui/AppIcon";

interface AdminOverviewClientProps {
  stats: {
    revenue: number;
    orders: number;
    customers: number;
    products: number;
  };
  recentOrders: {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
  }[];
}

export default function AdminOverviewClient({
  stats,
  recentOrders,
}: AdminOverviewClientProps) {
  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
      icon: "CurrencyRupeeIcon",
    },
    {
      label: "Total Orders",
      value: stats.orders.toString(),
      icon: "ShoppingBagIcon",
    },
    {
      label: "Customers",
      value: stats.customers.toString(),
      icon: "UserGroupIcon",
    },
    {
      label: "Products",
      value: stats.products.toString(),
      icon: "CubeIcon",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-success/10 text-success";
      case "shipped":
        return "bg-warning/10 text-warning";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Icon name={stat.icon as any} size={24} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-serif text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-serif text-2xl mb-6">Recent Orders</h2>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between p-4 border border-border rounded-xl"
            >
              <div>
                <p className="font-mono font-semibold">#{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif">
                  ₹{order.total_amount.toLocaleString("en-IN")}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
