"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { label: "Overview", href: "/admin", icon: "ChartBarIcon" },
    { label: "Orders", href: "/admin/orders", icon: "ShoppingBagIcon" },
    { label: "Products", href: "/admin/products", icon: "CubeIcon" },
    { label: "Categories", href: "/admin/categories", icon: "TagIcon" },
    { label: "Offers", href: "/admin/offers", icon: "TicketIcon" },
  ];

  if (role === "super_admin") {
    links.push({
      label: "Super Admin",
      href: "/admin/super-admin",
      icon: "ShieldCheckIcon",
    });
  }

  async function handleLogout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 bg-card border border-border rounded-2xl p-4 h-fit flex flex-col justify-between">
      <div>
        <h2 className="font-serif text-xl mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Icon name={link.icon as any} size={18} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-error"
      >
        <Icon name="ArrowLeftOnRectangleIcon" size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
}
