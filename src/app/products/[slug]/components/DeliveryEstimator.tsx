"use client";

import { useState } from "react";

export default function DeliveryEstimator() {
  const [pincode, setPincode] = useState("");
  const [eta, setEta] = useState<string | null>(null);

  const checkDelivery = () => {
    if (pincode.length !== 6) {
      alert("Enter valid 6-digit pincode");
      return;
    }

    // Fake logic for now
    setEta("Delivery by Tomorrow 🚚");
  };

  return (
    <div className="mt-6 border rounded-xl p-4 space-y-3">
      <h4 className="font-medium">Check Delivery</h4>

      <div className="flex gap-3">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter Pincode"
          className="border rounded px-3 py-2 w-full"
        />

        <button
          onClick={checkDelivery}
          className="px-4 bg-primary text-white rounded"
        >
          Check
        </button>
      </div>

      {eta && <p className="text-green-600">{eta}</p>}
    </div>
  );
}
