import { Metadata } from "next";
import AdminOrders from "./components/AdminOrders";

export const metadata: Metadata = {
  title: "Orders - Admin | TheSmileHamper",
  description: "Manage all customer orders",
};

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
