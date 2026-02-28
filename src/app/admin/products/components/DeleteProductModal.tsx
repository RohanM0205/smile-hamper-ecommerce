"use client";

import { deleteProduct } from "../actions/deleteProduct";

export default function DeleteProductModal({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Delete Product</h2>
        <p className="text-sm mb-6">
          Are you sure? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={async () => {
              await deleteProduct(productId);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
