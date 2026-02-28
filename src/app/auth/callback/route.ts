import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Exchange OAuth code for session (this sets cookies)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login`);
    }
  }

  // Now safely get user (session should exist)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User fetch error:", userError?.message);
    return NextResponse.redirect(`${origin}/login`);
  }

  // Fetch profile role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError.message);
    return NextResponse.redirect(`${origin}/profile`);
  }

  // Role-based redirection
  if (profile?.role === "super_admin") {
    return NextResponse.redirect(`${origin}/admin/super-admin`);
  }

  if (profile?.role === "admin") {
    return NextResponse.redirect(`${origin}/admin`);
  }

  // Default user redirect
  return NextResponse.redirect(`${origin}/profile`);
}
