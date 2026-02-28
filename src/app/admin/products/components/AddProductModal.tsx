"use client";

import ProductForm from "./ProductForm";

interface Category {
  id: string;
  name: string;
}

export default function AddProductModal({
  open,
  onClose,
  categories = [],
}: {
  open: boolean;
  onClose: () => void;
  categories?: Category[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-serif mb-4">Add Product</h2>
        <ProductForm
          onClose={onClose}
        />
      </div>
    </div>
  );
}
