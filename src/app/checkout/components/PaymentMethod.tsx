interface Props {
    value: string;
    onChange: (val: string) => void;
  }
  
  export default function PaymentMethod({ value, onChange }: Props) {
    return (
      <div className="bg-card border rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-serif">Payment Method</h2>
  
        <label className="flex gap-3 items-center">
          <input
            type="radio"
            checked={value === "cod"}
            onChange={() => onChange("cod")}
          />
          Cash on Delivery
        </label>
  
        <label className="flex gap-3 items-center">
          <input
            type="radio"
            checked={value === "razorpay"}
            onChange={() => onChange("razorpay")}
          />
          Razorpay (Online Payment)
        </label>
      </div>
    );
  }