"use client";

import Icon from "@/components/ui/AppIcon";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useState } from "react";

interface Props {
  user: User;
  role: string;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function ProfileSidebar({
  user,
  role,
  activeTab,
  setActiveTab,
}: Props) {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [loggingOut, setLoggingOut] = useState(false);

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "User";

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="space-y-4">
      {/* User Card */}
      <div className="bg-card border rounded-2xl p-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="UserCircleIcon" size={40} />
        </div>
        <h2 className="font-serif text-xl mb-1">
          {fullName}
        </h2>
        <p className="text-sm text-muted-foreground">
          {user.email}
        </p>
      </div>

      {/* Navigation */}
      <nav className="bg-card border rounded-2xl p-2 space-y-1">
        {[
          ["orders", "My Orders", "ShoppingBagIcon"],
          ["profile", "Profile Settings", "UserIcon"],
          ["addresses", "Addresses", "MapPinIcon"],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
              activeTab === key
                ? "bg-primary text-white"
                : "hover:bg-muted"
            }`}
          >
            <Icon name={icon as any} size={20} />
            {label}
          </button>
        ))}

        {/* Admin Panel */}
        {role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted"
          >
            <Icon name="ShieldCheckIcon" size={20} />
            Admin Panel
          </button>
        )}

        {/* Super Admin Panel */}
        {role === "super_admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted"
          >
            <Icon name="StarIcon" size={20} />
            Super Admin Panel
          </button>
        )}
      </nav>

      {/* Logout */}
      <div className="bg-card border rounded-2xl p-2">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10"
        >
          <Icon name="ArrowRightOnRectangleIcon" size={20} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}