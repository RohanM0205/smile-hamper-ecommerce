"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import { supabaseBrowser } from "@/lib/supabase/client";

interface NavLink {
  id: string;
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { id: "nav_home", label: "Home", href: "/homepage" },
  { id: "nav_products", label: "Shop Gifts", href: "/products" },
  { id: "nav_occasions", label: "Occasions", href: "#" },
  { id: "nav_hampers", label: "Hampers", href: "#" },
  { id: "nav_offers", label: "Offers", href: "/offers" },
  { id: "nav_about", label: "About", href: "#" },
];

const occasions = [
  { id: "occ_birthday", name: "Birthday", slug: "birthday", icon: "CakeIcon" },
  { id: "occ_anniversary", name: "Anniversary", slug: "anniversary", icon: "HeartIcon" },
  { id: "occ_festivals", name: "Festivals", slug: "festivals", icon: "SparklesIcon" },
  { id: "occ_special_days", name: "Special Days", slug: "special-days", icon: "CalendarDaysIcon" },
  { id: "occ_valentines", name: "Valentine's", slug: "valentines", icon: "HeartIcon" },
  { id: "occ_wedding", name: "Wedding", slug: "wedding", icon: "GiftIcon" },
  { id: "occ_bulk", name: "Bulk", slug: "bulk", icon: "BriefcaseIcon" },
  { id: "occ_others", name: "Others", slug: "others", icon: "Squares2X2Icon" },
];

const hampers = [
  {
    id: "hamper_our",
    name: "Our Hampers",
    href: "/hampers",
    icon: "GiftIcon",
  },
  {
    id: "hamper_build",
    name: "Build Your Own Hamper",
    href: "/hampers/build",
    icon: "SparklesIcon",
  },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const [isHampersOpen, setIsHampersOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [firstName, setFirstName] = useState<string | null>(null);

  const occasionsRef = useRef<HTMLDivElement | null>(null);
const hampersRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- Scroll effect ---------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
  
    if (!data.user) {
      setFirstName(null);
      return;
    }
  
    const name =
      data.user.user_metadata?.first_name ||
      data.user.user_metadata?.full_name?.split(" ")[0] ||
      null;
  
    setFirstName(name);
  }, [supabase]);

  const fetchWishlistCount = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist/count");
      if (!res.ok) return;
  
      const data = await res.json();
      setWishlistCount(data.count || 0);
    } catch (error) {
      console.error("Failed to fetch wishlist count:", error);
    }
  }, []);


  

  /* ---------------- Listen for Wishlist Updates ---------------- */
useEffect(() => {
  const handleWishlistUpdate = () => {
    fetchWishlistCount();
  };

  window.addEventListener("wishlistUpdated", handleWishlistUpdate);

  return () => {
    window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  };
}, [fetchWishlistCount]);

  /* ---------------- Fetch Cart Count ---------------- */
  const fetchCartCount = useCallback(async () => {
    try {
      const res = await fetch("/api/cart/get");
      if (!res.ok) return;

      const data = await res.json();

      const totalQuantity =
        data.items?.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        ) || 0;

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  }, []);

  // Wishlist listener
useEffect(() => {
  const handleWishlistUpdate = () => {
    fetchWishlistCount();
  };

  window.addEventListener("wishlistUpdated", handleWishlistUpdate);

  return () => {
    window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  };
}, [fetchWishlistCount]);

// Cart listener
useEffect(() => {
  const handleCartUpdate = () => {
    fetchCartCount();
  };

  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
    window.removeEventListener("cartUpdated", handleCartUpdate);
  };
}, [fetchCartCount]);

  useEffect(() => {
    fetchUser();
    fetchCartCount();
    fetchWishlistCount();
  }, [fetchUser, fetchCartCount, fetchWishlistCount, pathname]);

  /* ---------------- Auto Close Dropdown ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
  
      if (
        occasionsRef.current &&
        !occasionsRef.current.contains(target)
      ) {
        setIsOccasionsOpen(false);
      }
  
      if (
        hampersRef.current &&
        !hampersRef.current.contains(target)
      ) {
        setIsHampersOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAccountClick = () => {
    router.push("/profile");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            href="/homepage"
            className="font-serif text-2xl tracking-tighter text-foreground hover:text-primary transition-colors"
          >
            TheSmileHamper<span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.id} className="relative">
                {link.label === "Hampers" ? (
  <div ref={hampersRef}>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsHampersOpen(!isHampersOpen);
        setIsOccasionsOpen(false);
      }}
      className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
    >
      {link.label}
      <Icon
        name="ChevronDownIcon"
        size={16}
        className="inline-block ml-1"
      />
    </button>

    {isHampersOpen && (
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fadeIn">
        {hampers.map((hamper) => (
          <Link
            key={hamper.id}
            href={hamper.href}
            onClick={() => setIsHampersOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition"
          >
            <Icon
              name={hamper.icon as any}
              size={20}
              className="text-primary"
            />
            <span className="text-sm font-medium">
              {hamper.name}
            </span>
          </Link>
        ))}
      </div>
    )}
  </div>
) : link.label === "Occasions" ? (
                  <div ref={occasionsRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOccasionsOpen(!isOccasionsOpen);
                      }}
                      className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                      <Icon
                        name="ChevronDownIcon"
                        size={16}
                        className="inline-block ml-1"
                      />
                    </button>

                    {isOccasionsOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fadeIn">
                        {occasions.map((occasion) => (
                          <Link
                            key={occasion.id}
                            href={`/occasions/${occasion.slug}`}
                            onClick={() => setIsOccasionsOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition"
                          >
                            <Icon
                              name={occasion.icon as any}
                              size={20}
                              className="text-primary"
                            />
                            <span className="text-sm font-medium">
                              {occasion.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
          <span className="text-sm text-foreground/80 mr-2">
  Hello,{" "}
  <span className="font-medium text-primary">
    {firstName || "User"}
  </span>
</span>
          <Link
  href="/wishlist"
  className="relative p-2 rounded-full hover:bg-muted"
>
  <Icon name="HeartIcon" size={20} />
  {wishlistCount > 0 && (
    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-primary text-xs rounded-full flex items-center justify-center text-primary-foreground">
      {wishlistCount}
    </span>
  )}
</Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-muted"
            >
              <Icon name="ShoppingBagIcon" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-primary text-xs rounded-full flex items-center justify-center text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleAccountClick}
              className="p-2 rounded-full hover:bg-muted"
            >
              <Icon name="UserIcon" size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-muted"
          >
            <Icon
              name={isMobileMenuOpen ? "XMarkIcon" : "Bars3Icon"}
              size={24}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">

            <nav className="space-y-3">
              {navLinks.map((link) =>
                link.label === "Hampers" ? (
                  <div key={link.id} className="space-y-2">
                    <p className="px-4 text-sm font-semibold text-muted-foreground">
                      Hampers
                    </p>
                
                    {hampers.map((hamper) => (
                      <Link
                        key={hamper.id}
                        href={hamper.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 px-6 rounded-xl hover:bg-muted text-sm"
                      >
                        {hamper.name}
                      </Link>
                    ))}
                  </div>
                ) : link.label === "Occasions" ? (
                  <div key={link.id} className="space-y-2">
                    <p className="px-4 text-sm font-semibold text-muted-foreground">
                      Occasions
                    </p>

                    {occasions.map((occasion) => (
                      <Link
                        key={occasion.id}
                        href={`/occasions/${occasion.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 px-6 rounded-xl hover:bg-muted text-sm"
                      >
                        {occasion.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">

              <Link
                href="/wishlist"
                className="flex flex-col items-center gap-2 p-3"
              >
                <Icon name="HeartIcon" size={24} />
  {wishlistCount > 0 && (
    <span className="absolute top-2 right-2 min-w-[20px] h-5 px-1 bg-primary text-xs rounded-full flex items-center justify-center text-primary-foreground">
      {wishlistCount}
    </span>
  )}
  <span className="text-xs">Wishlist</span>
</Link>

              <Link
                href="/cart"
                className="flex flex-col items-center gap-2 p-3 relative"
              >
                <Icon name="ShoppingBagIcon" size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-[20px] h-5 px-1 bg-primary text-xs rounded-full flex items-center justify-center text-primary-foreground">
                    {cartCount}
                  </span>
                )}
                <span className="text-xs">Cart</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleAccountClick();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted"
              >
                <Icon name="UserIcon" size={24} />
                <span className="text-xs">Account</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
