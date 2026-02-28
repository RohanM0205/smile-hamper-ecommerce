import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
