"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import { supabaseBrowser } from "@/lib/supabase/client";

const SignupClient: React.FC = () => {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =========================
     EMAIL / PASSWORD SIGNUP
     ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Account created successfully. Please login.");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  /* =========================
     GOOGLE OAUTH SIGNUP
     ========================= */
  const handleGoogleAuth = async () => {
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });

    if (error) {
      console.error("Google auth error:", error.message);
      setError(error.message);
    }
  };

  /* =========================
     FACEBOOK OAUTH SIGNUP
     (TEMPORARILY DISABLED – META VERIFICATION PENDING)
     ========================= */
  /*
  const handleFacebookAuth = async () => {
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });

    if (error) {
      console.error("Facebook auth error:", error.message);
      setError(error.message);
    }
  };
  */

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-card border border-border rounded-3xl p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join TheSmileHamper family today
          </p>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 text-green-600 text-sm px-4 py-3">
            {success}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-1 text-primary"
            />
            <label className="text-sm text-foreground">
              I agree to the{" "}
              <Link href="#" className="text-primary hover:text-primary/80">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social Signup (ONLY GOOGLE ENABLED) */}
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

          {/*
          <button
            type="button"
            onClick={handleFacebookAuth}
            className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
          >
            <Icon name="UserCircleIcon" size={20} />
            <span className="text-sm font-medium text-foreground">
              Facebook
            </span>
          </button>
          */}
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:text-primary/80"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupClient;
