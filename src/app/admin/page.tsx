import { Metadata } from "next";
import AdminOverview from "./components/AdminOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard - TheSmileHamper",
  description: "Manage orders, products, and customers.",
};

export default function AdminPage() {
  const stats = {
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  };
  const recentOrders: {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
  }[] = [];
  return <AdminOverview stats={stats} recentOrders={recentOrders} />;
}
