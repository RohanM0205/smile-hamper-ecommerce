import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category id required" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Category fetch error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
