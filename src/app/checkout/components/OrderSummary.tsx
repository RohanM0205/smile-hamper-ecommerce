interface Props {
    cartItems: any[];
    placingOrder: boolean;
    onPlaceOrder: () => void;
  }
  
  export default function OrderSummary({
    cartItems,
    placingOrder,
    onPlaceOrder,
  }: Props) {
    return (
      <div className="bg-card border rounded-2xl p-6 space-y-4 sticky top-24">
        <h2 className="text-2xl font-serif">Order Summary</h2>
  
        {cartItems.map((item) => {
          const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products;
  
          return (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {product.name} × {item.quantity}
              </span>
              <span>
                ₹
                {(item.custom_price ??
                  product.discount_price ??
                  product.price) * item.quantity}
              </span>
            </div>
          );
        })}
  
        <button
          disabled={placingOrder}
          onClick={onPlaceOrder}
          className="w-full py-3 bg-primary text-white rounded-xl mt-4"
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    );
  }