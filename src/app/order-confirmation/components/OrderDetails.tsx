"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [data, setData] = useState<any>(null);
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
    const result = await res.json();

    if (!res.ok) {
      router.push("/");
      return;
    }

    setData(result);
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  const { order, items, shipping } = data;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif text-green-600">
          🎉 Order Confirmed!
        </h1>
        <p>Order ID: {order.id}</p>
        <p>
          Payment Status:{" "}
          <span className="font-semibold">
            {order.payment_status}
          </span>
        </p>
      </div>

      {/* Shipping Info */}
      <div className="bg-card border rounded-2xl p-6">
        <h2 className="text-2xl font-serif mb-4">
          Shipping Details
        </h2>
        <p>{shipping.full_name}</p>
        <p>{shipping.address}</p>
        <p>
          {shipping.city}, {shipping.state} -{" "}
          {shipping.pincode}
        </p>
        <p>{shipping.phone}</p>
      </div>

      {/* Order Items */}
      <div className="bg-card border rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-serif">
          Order Items
        </h2>

        {items.map((item: any) => {
          const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products;

          const image =
            product.product_images?.find(
              (img: any) => img.is_primary
            )?.image_url ||
            product.product_images?.[0]?.image_url;

          return (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex gap-4 items-center">
                {image && (
                  <img
                    src={image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {product.name}
                  </p>
                  <p className="text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="font-serif text-lg">
                ₹{item.price * item.quantity}
              </div>
            </div>
          );
        })}

        <div className="flex justify-between text-xl font-serif pt-4">
          <span>Total Paid</span>
          <span>₹{order.total_amount}</span>
        </div>
      </div>

      {/* Next Steps */}
      {order.payment_status === "cod_pending" && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <p>
            💵 Please keep cash ready at the time of
            delivery.
          </p>
        </div>
      )}

      {order.payment_status === "awaiting_payment" && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <p>
            ⏳ Waiting for payment confirmation.
          </p>
        </div>
      )}
    </div>
  );
}