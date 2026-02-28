import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const supabase = await supabaseServer();
    const body = await req.json();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    // Count existing addresses
    const { count } = await supabase
      .from("user_addresses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
  
    if (count && count >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 addresses allowed" },
        { status: 400 }
      );
    }
  
    // If new address is default → unset others
    if (body.is_default) {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }
  
    const { data, error } = await supabase
      .from("user_addresses")
      .insert({
        user_id: user.id,
        ...body,
      })
      .select()
      .single();
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  
    return NextResponse.json({ address: data });
  }