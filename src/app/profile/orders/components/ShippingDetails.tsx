interface Props {
    shipping: any;
  }
  
  export default function ShippingDetails({ shipping }: Props) {
    if (!shipping) {
      return (
        <div className="bg-card border rounded-2xl p-6">
          <p>No shipping details found.</p>
        </div>
      );
    }
  
    return (
      <div className="bg-card border rounded-2xl p-6">
        <h2 className="font-serif text-2xl mb-4">
          Shipping Details
        </h2>
  
        <div className="text-sm space-y-1">
          <p className="font-medium">
            {shipping.full_name}
          </p>
          <p>{shipping.address}</p>
          <p>
            {shipping.city}, {shipping.state} -{" "}
            {shipping.pincode}
          </p>
          <p>{shipping.phone}</p>
          <p>{shipping.email}</p>
        </div>
      </div>
    );
  }