"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";

interface CartItem {
  id: string;
  quantity: number;
  gift_wrap: boolean;

  // 🔥 NEW
  custom_price?: number | null;
  customization?: any;

  products: {
    id: string;
    name: string;
    price: number;
    discount_price: number | null;
    gift_wrap_price: number;
    stock: number;
    product_images: {
      image_url: string;
      is_primary: boolean;
    }[];
  };
}

interface Coupon {
  id: string;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  min_cart_value?: number;
  max_discount?: number;
}

const FREE_WRAP_THRESHOLD = 3000;

const CartClient: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch("/api/cart/get");
    const data = await res.json();
    setCartItems(data.items || []);
    setLoading(false);
  };

  /* ================= CALCULATIONS ================= */

  const {
    cartWithTotals,
    baseSubtotal,
    giftWrapTotal,
    subtotal,
    shipping,
    discount,
    finalTotal,
    isGiftWrapFree,
    amountToUnlockWrap,
  } = useMemo(() => {

    // 🔥 SUPPORT CUSTOM PRICE
    const computedBaseSubtotal = cartItems.reduce((sum, item) => {
      const unitPrice =
        item.custom_price ??
        item.products.discount_price ??
        item.products.price;

      return sum + unitPrice * item.quantity;
    }, 0);

    const freeWrap =
      computedBaseSubtotal >= FREE_WRAP_THRESHOLD;

    const enrichedItems = cartItems.map((item) => {

      const unitPrice =
        item.custom_price ??
        item.products.discount_price ??
        item.products.price;

      const wrapUnitPrice = freeWrap
        ? 0
        : item.products.gift_wrap_price || 49;

      const itemWrapTotal =
        item.gift_wrap
          ? wrapUnitPrice * item.quantity
          : 0;

      const itemBaseTotal =
        unitPrice * item.quantity;

      return {
        ...item,
        unitPrice,
        wrapUnitPrice,
        itemBaseTotal,
        itemWrapTotal,
        itemFinalTotal:
          itemBaseTotal + itemWrapTotal,
      };
    });

    const computedGiftWrapTotal =
      enrichedItems.reduce(
        (sum, item) => sum + item.itemWrapTotal,
        0
      );

    const computedSubtotal =
      computedBaseSubtotal + computedGiftWrapTotal;

    const computedShipping =
      computedSubtotal > 2000 ? 0 : 99;

    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discount_type === "percent") {
        discount =
          (computedSubtotal * appliedCoupon.discount_value) / 100;

        if (appliedCoupon.max_discount) {
          discount = Math.min(
            discount,
            appliedCoupon.max_discount
          );
        }
      } else {
        discount = appliedCoupon.discount_value;
      }

      if (
        appliedCoupon.min_cart_value &&
        computedSubtotal < appliedCoupon.min_cart_value
      ) {
        discount = 0;
      }
    }

    const computedFinalTotal =
      computedSubtotal - discount + computedShipping;

    return {
      cartWithTotals: enrichedItems,
      baseSubtotal: computedBaseSubtotal,
      giftWrapTotal: computedGiftWrapTotal,
      subtotal: computedSubtotal,
      shipping: computedShipping,
      discount,
      finalTotal: computedFinalTotal,
      isGiftWrapFree: freeWrap,
      amountToUnlockWrap:
        FREE_WRAP_THRESHOLD - computedBaseSubtotal,
    };

  }, [cartItems, appliedCoupon]);

  /* ================= UPDATE QUANTITY ================= */

  const updateQuantity = async (
    item: CartItem,
    newQty: number
  ) => {
    if (newQty < 1) return;
    if (newQty > item.products.stock) return;
  
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  
    const controller = new AbortController();
    controllerRef.current = controller;
  
    setUpdatingId(item.id);
  
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: newQty }
          : i
      )
    );
  
    try {
      await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          quantity: newQty,
        }),
        signal: controller.signal,
      });
  
      // 🔥 Notify header
      window.dispatchEvent(new Event("cartUpdated"));
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= TOGGLE GIFT WRAP ================= */

  const toggleGiftWrap = async (item: CartItem) => {
    setUpdatingId(item.id);
  
    const updatedValue = !item.gift_wrap;
  
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, gift_wrap: updatedValue }
          : i
      )
    );
  
    await fetch("/api/cart/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.id,
        gift_wrap: updatedValue,
      }),
    });
  
    // 🔥 Notify header
    window.dispatchEvent(new Event("cartUpdated"));
  
    setUpdatingId(null);
  };

  /* ================= REMOVE ITEM ================= */

  const removeItem = async (itemId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
  
    await fetch("/api/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
  
    // 🔥 Notify header
    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* ================= COUPON ================= */

  const applyCoupon = async () => {
    if (!couponCode) return;

    setCouponError("");
    setCouponLoading(true);

    try {
      const res = await fetch("/api/cart/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon");
        return;
      }

      setAppliedCoupon(data.coupon);
      setCouponCode("");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = async () => {
    await fetch("/api/cart/remove-coupon", {
      method: "POST",
    });

    setAppliedCoupon(null);
  };

  /* ================= UI ================= */

  if (loading) return <p>Loading cart...</p>;
  if (cartItems.length === 0)
    return <p>Your cart is empty</p>;

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-8">

      {/* ================= ITEMS ================= */}
      <div className="space-y-4">
        {cartWithTotals.map((item) => {

          const image =
            item.products.product_images?.find(
              (img) => img.is_primary
            )?.image_url ||
            item.products.product_images?.[0]?.image_url;

          return (
            <div
              key={item.id}
              className="bg-card border rounded-2xl p-4 flex gap-4"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden">
                <AppImage
                  src={image}
                  alt={item.products.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-medium">
                  {item.products.name}
                </h3>

                <p className="text-lg font-serif">
                  ₹{item.unitPrice}
                </p>

                {/* 🔥 Customization Summary */}
                {item.customization && (
                  <div className="text-sm mt-2 text-muted-foreground space-y-1">
                    {item.customization.senderName && (
                      <p>From: {item.customization.senderName}</p>
                    )}
                    {item.customization.engraving && (
                      <p>Engraving: {item.customization.engraving}</p>
                    )}
                    {item.customization.cardSelected && <p>Card Added</p>}
                    {item.customization.extrasSelected && <p>Extras Included</p>}
                  </div>
                )}

                {/* 🎁 Gift Wrap Toggle */}
                <button
                  disabled={updatingId === item.id}
                  onClick={() => toggleGiftWrap(item)}
                  className="mt-2 text-sm text-purple-600"
                >
                  {!item.gift_wrap && "Add "}
                  🎁 Premium Gift Wrap{" "}
                  {isGiftWrapFree
                    ? "(FREE)"
                    : `(+₹${item.wrapUnitPrice})`}
                </button>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right font-serif text-xl">
                ₹{item.itemFinalTotal}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="bg-card border rounded-2xl p-6">

        <h2 className="font-serif text-2xl mb-4">
          Order Summary
        </h2>

        {/* FREE WRAP BANNER */}
        {!isGiftWrapFree && baseSubtotal > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium">
            Add ₹{amountToUnlockWrap} more to unlock FREE Premium Gift Wrap 🎁
          </div>
        )}

        {isGiftWrapFree && (
          <div className="mb-4 p-3 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium">
            🎉 Congratulations! You unlocked FREE Premium Gift Wrap!
          </div>
        )}

        {/* COUPON UI */}
        <div className="mb-4 border-b pb-4">
          {appliedCoupon ? (
            <div className="flex justify-between items-center bg-green-50 text-green-700 p-3 rounded-xl text-sm">
              <span>Coupon Applied: {appliedCoupon.code}</span>
              <button onClick={removeCoupon} className="text-red-500">
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) =>
                    setCouponCode(e.target.value.toUpperCase())
                  }
                  placeholder="Enter coupon code"
                  className="flex-1 border px-3 py-2 rounded-lg text-sm"
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
                >
                  {couponLoading ? "Applying..." : "Apply"}
                </button>
              </div>

              {couponError && (
                <p className="text-red-600 text-sm mt-2">
                  {couponError}
                </p>
              )}
            </>
          )}
        </div>

        <div className="space-y-3 border-b pb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{baseSubtotal}</span>
          </div>

          <div className="flex justify-between text-purple-600">
            <span>Gift Wrap</span>
            <span>
              {isGiftWrapFree ? "FREE" : `₹${giftWrapTotal}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between text-xl font-serif pt-4">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>

        <Link
          href="/checkout"
          className="block mt-6 w-full py-3 rounded-xl text-center bg-primary text-white"
        >
          Proceed to Checkout
        </Link>

      </div>

    </div>
  );
};

export default CartClient;
