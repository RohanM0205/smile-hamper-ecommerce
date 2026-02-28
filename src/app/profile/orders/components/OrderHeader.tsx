interface Props {
    order: any;
  }
  
  export default function OrderHeader({ order }: Props) {
    return (
      <div className="bg-card border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-serif text-3xl">
            Order #{order.id.slice(0, 8)}
          </h1>
          <span className="capitalize text-sm px-3 py-1 rounded-full bg-muted">
            {order.status}
          </span>
        </div>
  
        <p className="text-muted-foreground text-sm">
          Placed on{" "}
          {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>
    );
  }