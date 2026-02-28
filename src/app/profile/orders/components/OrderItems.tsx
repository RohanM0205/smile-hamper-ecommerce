interface Props {
    items: any[];
  }
  
  export default function OrderItems({ items }: Props) {
    if (!items.length) {
      return (
        <div className="bg-card border rounded-2xl p-6">
          <p>No items found for this order.</p>
        </div>
      );
    }
  
    return (
      <div className="bg-card border rounded-2xl p-6">
        <h2 className="font-serif text-2xl mb-4">Items</h2>
  
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-3"
            >
              <div>
                <p className="font-medium">
                  {item.product?.name || "Product"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
  
              <p className="font-semibold">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }