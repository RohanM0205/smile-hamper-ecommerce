import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();

    // ----------------------------
    // 1️⃣ Get Logged In User
    // ----------------------------
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ----------------------------
    // 2️⃣ Parse Request
    // ----------------------------
    const body = await req.json();

    const {
      productId,
      quantity = 1,
      customization = null,
      customPrice = null,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID missing" },
        { status: 400 }
      );
    }

    // ----------------------------
    // 3️⃣ Check Product Exists + Stock
    // ----------------------------
    const { data: product, error: productError } =
      await supabase
        .from("products")
        .select("id, stock")
        .eq("id", productId)
        .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 400 }
      );
    }

    // ----------------------------
    // 4️⃣ Get or Create Cart
    // ----------------------------
    const { data: existingCart, error: cartSelectError } =
      await supabase
        .from("carts")
        .select("*")
        .eq("user_id", user.id)
        .single();

    let cart = existingCart;

    if (
      cartSelectError &&
      cartSelectError.code !== "PGRST116"
    ) {
      return NextResponse.json(
        { error: cartSelectError.message },
        { status: 500 }
      );
    }

    if (!existingCart) {
      const {
        data: newCart,
        error: cartInsertError,
      } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (cartInsertError || !newCart) {
        return NextResponse.json(
          { error: "Cart creation failed" },
          { status: 500 }
        );
      }

      cart = newCart;
    }

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not available" },
        { status: 500 }
      );
    }

    // ----------------------------
    // 5️⃣ Check Existing Cart Item
    // ----------------------------
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: "Not enough stock available" },
          { status: 400 }
        );
      }

      const { error: updateError } =
        await supabase
          .from("cart_items")
          .update({
            quantity: newQuantity,
            customization: customization,
            custom_price: customPrice,
          })
          .eq("id", existingItem.id);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } =
        await supabase
          .from("cart_items")
          .insert({
            cart_id: cart.id,
            product_id: productId,
            quantity,
            customization,
            custom_price: customPrice,
          });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    // ----------------------------
    // 6️⃣ Success
    // ----------------------------
    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {
    console.error("Cart add error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
