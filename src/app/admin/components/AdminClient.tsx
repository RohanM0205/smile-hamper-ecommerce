"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/AppIcon";

interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: string;
  trend: "up" | "down";
}

const AdminClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products">("overview");

  const stats: StatCard[] = [
    {
      id: "stat_revenue",
      label: "Total Revenue",
      value: "₹2,45,890",
      change: "+12.5%",
      icon: "CurrencyRupeeIcon",
      trend: "up",
    },
    {
      id: "stat_orders",
      label: "Total Orders",
      value: "156",
      change: "+8.2%",
      icon: "ShoppingBagIcon",
      trend: "up",
    },
    {
      id: "stat_customers",
      label: "Customers",
      value: "89",
      change: "+15.3%",
      icon: "UserGroupIcon",
      trend: "up",
    },
    {
      id: "stat_products",
      label: "Products",
      value: "42",
      change: "+3",
      icon: "CubeIcon",
      trend: "up",
    },
  ];

  const recentOrders = [
    {
      id: "TSHX7K9M2",
      customer: "Priya Sharma",
      amount: 6097,
      status: "Delivered",
      date: "2026-02-01",
    },
    {
      id: "TSHP4N8L1",
      customer: "Rahul Verma",
      amount: 3499,
      status: "In Transit",
      date: "2026-01-31",
    },
    {
      id: "TSHQ2M5K9",
      customer: "Anita Desai",
      amount: 1899,
      status: "Processing",
      date: "2026-01-30",
    },
  ];

  const products = [
    {
      id: "prod_1",
      name: "Deluxe Chocolate Hamper",
      price: 1499,
      stock: 45,
      sales: 128,
    },
    {
      id: "prod_2",
      name: "Premium Dry Fruits Gift Box",
      price: 2299,
      stock: 32,
      sales: 96,
    },
    {
      id: "prod_3",
      name: "Gourmet Tea Collection",
      price: 899,
      stock: 18,
      sales: 64,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success/10 text-success";
      case "In Transit":
        return "bg-warning/10 text-warning";
      case "Processing":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "overview" ?"text-primary border-b-2 border-primary" :"text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "orders" ?"text-primary border-b-2 border-primary" :"text-muted-foreground hover:text-foreground"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "products" ?"text-primary border-b-2 border-primary" :"text-muted-foreground hover:text-foreground"
          }`}
        >
          Products
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name={stat.icon as any} size={24} className="text-primary" />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      stat.trend === "up" ? "text-success" : "text-error"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm text-muted-foreground mb-1">{stat.label}</h3>
                <p className="font-serif text-3xl text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-foreground">Recent Orders</h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-mono font-semibold text-foreground mb-1">
                      #{order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg text-foreground mb-1">
                      ₹{order.amount}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        getStatusColor(order.status)
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-serif text-2xl text-foreground">All Orders</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search orders..."
                className="px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select className="px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All Status</option>
                <option>Processing</option>
                <option>In Transit</option>
                <option>Delivered</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-6 py-4 font-mono text-sm text-foreground">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-serif text-foreground">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          getStatusColor(order.status)
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-primary/80">
                        <Icon name="EyeIcon" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-foreground">Product Management</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              <Icon name="PlusIcon" size={18} />
              Add Product
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-colors"
              >
                <h3 className="font-medium text-foreground mb-3">{product.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-serif text-foreground">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock</span>
                    <span
                      className={`font-medium ${
                        product.stock < 20 ? "text-warning" : "text-success"
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sales</span>
                    <span className="font-medium text-foreground">{product.sales}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClient;