"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import { supabaseBrowser } from "@/lib/supabase/client";

const LoginClient: React.FC = () => {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =========================
     EMAIL / PASSWORD LOGIN
     ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ✅ Always go through callback for role-based redirect
    router.push("/auth/callback");
    router.refresh();
  };

  /* =========================
     GOOGLE OAUTH LOGIN
     ========================= */
  const handleGoogleAuth = async () => {
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-card border border-border rounded-3xl p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Login to access your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary" />
              <span className="text-foreground">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-primary hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
          >
            <Icon name="UserCircleIcon" size={20} />
            <span className="text-sm font-medium text-foreground">
              Continue with Google
            </span>
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginClient;
