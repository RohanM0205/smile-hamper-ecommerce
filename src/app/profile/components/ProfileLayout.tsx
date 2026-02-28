"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import ProfileSidebar from "@/app/profile/components/ProfileSidebar";
import OrdersTab from "@/app/profile/components/OrdersTab";
import ProfileTab from "@/app/profile/components/ProfileTab";
import AddressesTab from "@/app/profile/components/AddressesTab";

interface Props {
  user: User;
  role: string;
  orders: any[];
}

export default function ProfileLayout({
  user,
  role,
  orders,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<"orders" | "profile" | "addresses">("orders");

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
      <ProfileSidebar
        user={user}
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div>
        {activeTab === "orders" && (
          <OrdersTab orders={orders} />
        )}
        {activeTab === "profile" && (
          <ProfileTab user={user} />
        )}
        {activeTab === "addresses" && (
          <AddressesTab />
        )}
      </div>
    </div>
  );
}