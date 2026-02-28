// src/app/admin/products/loading.tsx
export default function Loading() {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-muted rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }
  