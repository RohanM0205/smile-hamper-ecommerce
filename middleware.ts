import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  // ✅ Allow OAuth callback
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  console.log("MIDDLEWARE HIT:", req.nextUrl.pathname);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("MIDDLEWARE USER:", user?.id);

  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  const isProfilePage =
    pathname === "/profile" || pathname.startsWith("/profile/");

  const isAdminRoute = pathname.startsWith("/admin");
  const isSuperAdminRoute = pathname.startsWith("/admin/super");

  // ❌ Not logged in
  if (!user && (isProfilePage || isAdminRoute || isSuperAdminRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔄 Logged in user visiting login/signup
  if (user && isAuthPage) {
    console.log("MIDDLEWARE: user hit auth page");
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      console.log("MIDDLEWARE ROLE:", profile?.role);
  
    if (profile?.role === "super_admin") {
      return NextResponse.redirect(new URL("/admin/super", req.url));
    }
  
    if (profile?.role === "admin") {
      console.log("MIDDLEWARE redirect → /admin");
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  
    return NextResponse.redirect(new URL("/profile", req.url));
  }
  

  // 🔐 Role-based checks
  if (user && (isAdminRoute || isSuperAdminRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      isSuperAdminRoute &&
      profile?.role !== "super_admin"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (
      isAdminRoute &&
      !["admin", "super_admin"].includes(profile?.role)
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/profile",
    "/profile/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
