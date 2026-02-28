import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function DELETE(req: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId } = await req.json();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
