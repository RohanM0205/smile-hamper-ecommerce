"use client";

import { useState } from "react";
import { deleteCategory } from "../actions";

export default function DeleteCategoryModal({
  categoryId,
  onClose,
}: {
  categoryId: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setErrorMsg(null);

    try {
      await deleteCategory(categoryId);
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message ?? "Failed to delete category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-2xl w-full max-w-sm space-y-4">
        <h2 className="font-serif text-lg">
          Delete this category?
        </h2>

        {/* Error message */}
        {errorMsg && (
          <div className="text-sm text-error bg-error/10 p-3 rounded-lg">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-error text-white rounded-xl"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
