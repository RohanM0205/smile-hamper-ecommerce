"use client";

import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/AppIcon";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  user: User | null;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ user }) => {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [activeTab, setActiveTab] =
    useState<"orders" | "profile" | "addresses">("orders");
  const [loggingOut, setLoggingOut] = useState(false);

  /* --------------------------------
     🔐 Redirect if user is null
  -------------------------------- */
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  // While redirecting, render nothing (or loader if you want)
  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground text-lg">
          Redirecting to login…
        </p>
      </div>
    );
  }

  /* --------------------------------
     User data (safe)
  -------------------------------- */
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "User";

  const email = user.email || "";
  const [firstName = "", lastName = ""] = fullName.split(" ");

  /* --------------------------------
     Logout handler
  -------------------------------- */
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      router.replace("/login"); // no back navigation
    } catch (err) {
      console.error("Logout failed", err);
      setLoggingOut(false);
    }
  };

  /* --------------------------------
     Dummy orders (temporary)
  -------------------------------- */
  const orders: Order[] = [
    {
      id: "TSHX7K9M2",
      date: "2026-02-01",
      status: "Delivered",
      total: 6097,
      items: 3,
    },
    {
      id: "TSHP4N8L1",
      date: "2026-01-28",
      status: "In Transit",
      total: 3499,
      items: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success/10 text-success";
      case "In Transit":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
      {/* ================= Sidebar ================= */}
      <div className="space-y-4">
        {/* User card */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="UserCircleIcon" size={40} className="text-primary" />
          </div>

          <h2 className="font-serif text-xl text-foreground mb-1">
            {fullName}
          </h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        {/* Navigation */}
        <nav className="bg-card border border-border rounded-2xl p-2 space-y-1">
          {[
            ["orders", "My Orders", "ShoppingBagIcon"],
            ["profile", "Profile Settings", "UserIcon"],
            ["addresses", "Addresses", "MapPinIcon"],
          ].map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon name={icon as any} size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* 🚪 Logout */}
        <div className="bg-card border border-border rounded-2xl p-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors disabled:opacity-60"
          >
            <Icon name="ArrowRightOnRectangleIcon" size={20} />
            <span className="font-medium">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>

      {/* ================= Main Content ================= */}
      <div>
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-serif text-3xl mb-4">Order History</h2>

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-mono font-semibold">
                    #{order.id}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.items} items • ₹{order.total}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-serif text-3xl mb-6">
              Profile Settings
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  defaultValue={firstName}
                  className="px-4 py-3 border rounded-xl"
                  placeholder="First Name"
                />
                <input
                  defaultValue={lastName}
                  className="px-4 py-3 border rounded-xl"
                  placeholder="Last Name"
                />
              </div>

              <input
                value={email}
                disabled
                className="px-4 py-3 border rounded-xl bg-muted"
              />
            </div>
          </div>
        )}

        {activeTab === "addresses" && (
          <h2 className="font-serif text-3xl">
            Addresses coming next 🏠
          </h2>
        )}
      </div>
    </div>
  );
};

export default ProfileClient;
