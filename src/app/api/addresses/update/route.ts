import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
    const supabase = await supabaseServer();
    const body = await req.json();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    if (body.is_default) {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }
  
    const { data, error } = await supabase
      .from("user_addresses")
      .update(body)
      .eq("id", body.id)
      .eq("user_id", user.id)
      .select()
      .single();
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  
    return NextResponse.json({ address: data });
  }