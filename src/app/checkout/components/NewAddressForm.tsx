import { useState } from "react";

interface Props {
  onSuccess: (address: any) => void;
}

export default function NewAddressForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  const handleSubmit = async () => {
    const res = await fetch("/api/addresses/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    onSuccess(data.address);
  };

  return (
    <div className="bg-card border rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-serif">Add New Address</h2>

      <input
        placeholder="Full Name"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm({ ...form, full_name: e.target.value })
        }
      />

      <input
        placeholder="Phone"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <textarea
        placeholder="Address"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Save Address
      </button>
    </div>
  );
}