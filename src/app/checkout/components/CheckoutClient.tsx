"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderSummary from "@/app/checkout/components/OrderSummary";
import PaymentMethod from "@/app/checkout/components/PaymentMethod";
import AddressSelector from "@/app/checkout/components/AddressSelector";
import NewAddressForm from "@/app/checkout/components/NewAddressForm";

export interface Address {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const cartRes = await fetch("/api/cart/get");
      const cartData = await cartRes.json();

      if (!cartRes.ok || !cartData.items?.length) {
        router.push("/cart");
        return;
      }

      setCartItems(cartData.items);

      const addressRes = await fetch("/api/addresses/get");
      const addressData = await addressRes.json();

      if (addressData.addresses?.length) {
        setAddresses(addressData.addresses);

        const defaultAddress = addressData.addresses.find(
          (a: Address) => a.is_default
        );

        setSelectedAddressId(
          defaultAddress?.id || addressData.addresses[0].id
        );
      } else {
        setShowNewForm(true);
      }
    } catch (error) {
      console.error("Checkout init error:", error);
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select an address");
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await fetch("/api/checkout/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Order failed");
        setPlacingOrder(false);
        return;
      }

      /* ================= RAZORPAY FLOW ================= */

      if (paymentMethod === "razorpay") {
        if (!window.Razorpay) {
          alert("Payment gateway failed to load.");
          setPlacingOrder(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.razorpayOrder.amount,
          currency: "INR",
          name: "TheSmileHamper",
          description: "Order Payment",
          order_id: data.razorpayOrder.id,

          handler: async function (response: any) {
            try {
              const verifyRes = await fetch(
                "/api/checkout/verify-payment",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: data.orderId,
                  }),
                }
              );

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok) {
                alert("Payment verification failed");
                setPlacingOrder(false);
                return;
              }

              router.push(
                `/order-confirmation?orderId=${data.orderId}`
              );
            } catch (error) {
              console.error("Verification error:", error);
              alert("Payment verification failed");
              setPlacingOrder(false);
            }
          },

          modal: {
            ondismiss: function () {
              setPlacingOrder(false);
            },
          },

          theme: {
            color: "#000000",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      /* ================= COD FLOW ================= */

      router.push(`/order-confirmation?orderId=${data.orderId}`);
    } catch (error) {
      console.error("Place order error:", error);
      alert("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p>Loading checkout...</p>;

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      <div className="space-y-8">
        <AddressSelector
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelect={setSelectedAddressId}
          onAddNew={() => setShowNewForm(true)}
        />

        {showNewForm && (
          <NewAddressForm
            onSuccess={(newAddress) => {
              setAddresses((prev) => [newAddress, ...prev]);
              setSelectedAddressId(newAddress.id);
              setShowNewForm(false);
            }}
          />
        )}

        <PaymentMethod
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      <OrderSummary
        cartItems={cartItems}
        placingOrder={placingOrder}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}