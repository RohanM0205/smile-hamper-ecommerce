"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Icon from "@/components/ui/AppIcon";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const res = await fetch(`/api/orders/get?orderId=${orderId}`);
    const data = await res.json();

    if (!res.ok) {
      router.push("/");
      return;
    }

    setOrder(data.order);
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex justify-center items-center">
          <p>Loading order...</p>
        </main>
        <Footer />
      </>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paymentLabel =
    order.payment_status === "cod_pending"
      ? "Cash on Delivery"
      : order.payment_status === "awaiting_payment"
      ? "Online Payment (Pending)"
      : "Online Payment (Paid)";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center space-y-6 animate-fadeIn">
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="CheckCircleIcon" size={48} className="text-success" />
            </div>

            {/* Success Message */}
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">
                Order Confirmed!
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-muted/50 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="font-mono font-semibold text-foreground">
                  {order.id}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order Date</span>
                <span className="font-medium text-foreground">
                  {orderDate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="font-serif text-xl text-foreground">
                  ₹{order.total_amount}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="font-medium text-foreground">
                  {paymentLabel}
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="border-t border-border pt-6 space-y-4">
              <h2 className="font-serif text-2xl text-foreground">What's Next?</h2>

              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="flex gap-3">
                  <Icon name="EnvelopeIcon" size={24} className="text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Email Confirmation</h3>
                    <p className="text-sm text-muted-foreground">
                      Check your inbox for order details
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon name="TruckIcon" size={24} className="text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll prepare your order for delivery
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon name="GiftIcon" size={24} className="text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Delivery</h3>
                    <p className="text-sm text-muted-foreground">
                      Expected within 2-3 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/profile"
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-center hover:bg-primary/90 transition-colors"
              >
                View My Orders
              </Link>

              <Link
                href="/products"
                className="flex-1 py-3 border border-border text-foreground rounded-xl font-medium text-center hover:bg-muted transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}