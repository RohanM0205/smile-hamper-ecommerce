import { Address } from "./CheckoutClient";

interface Props {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
}

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
}: Props) {
  return (
    <div className="bg-card border rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-serif">Select Address</h2>

      {addresses.map((addr) => (
        <label
          key={addr.id}
          className="block border p-4 rounded-xl cursor-pointer"
        >
          <input
            type="radio"
            checked={selectedAddressId === addr.id}
            onChange={() => onSelect(addr.id)}
          />
          <div className="mt-2 text-sm">
            <p className="font-medium">{addr.full_name}</p>
            <p>{addr.address}</p>
            <p>
              {addr.city}, {addr.state} - {addr.pincode}
            </p>
            <p>{addr.phone}</p>
          </div>
        </label>
      ))}

      <button
        onClick={onAddNew}
        className="text-primary text-sm underline"
      >
        + Add New Address
      </button>
    </div>
  );
}