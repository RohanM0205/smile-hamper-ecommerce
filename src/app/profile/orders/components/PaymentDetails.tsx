interface Props {
    order: any;
  }
  
  export default function PaymentDetails({ order }: Props) {
    return (
      <div className="bg-card border rounded-2xl p-6">
        <h2 className="font-serif text-2xl mb-4">
          Payment Information
        </h2>
  
        <div className="space-y-2 text-sm">
          <p>
            <strong>Total:</strong> ₹{order.total_amount}
          </p>
  
          <p>
            <strong>Payment Status:</strong>{" "}
            <span className="capitalize">
              {order.payment_status}
            </span>
          </p>
  
          {order.payment_id && (
            <p>
              <strong>Payment ID:</strong>{" "}
              {order.payment_id}
            </p>
          )}
        </div>
  
        {/* Future: Invoice Download Button */}
        <div className="mt-4">
          <button className="px-4 py-2 rounded-xl bg-primary text-white">
            Download Invoice (Coming Soon)
          </button>
        </div>
      </div>
    );
  }