import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Offers API error:", error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data || []);
}