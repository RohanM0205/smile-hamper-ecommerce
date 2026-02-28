import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ count: 0 });
    }

    const { count, error } = await supabase
      .from("wishlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({
      count: count || 0,
    });

  } catch (err) {
    return NextResponse.json({ count: 0 });
  }
}