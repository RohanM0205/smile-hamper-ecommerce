"use client";

import { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export default function CategoryDetailsModal({
  category,
  categories,
  productCount,
  onClose,
}: {
  category: Category;
  categories: Category[];
  productCount: number;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  /* ==============================
     Copy to Clipboard
  ============================== */
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(category.id);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  const directChildren = categories.filter(
    (c) => c.parent_id === category.id
  );

  function countDescendants(parentId: string): number {
    const children = categories.filter((c) => c.parent_id === parentId);
    return children.reduce(
      (sum, child) => sum + 1 + countDescendants(child.id),
      0
    );
  }

  const totalDescendants = countDescendants(category.id);

  function getDepth(cat: Category): number {
    let depth = 0;
    let current = cat;

    while (current.parent_id) {
      const parent = categories.find((c) => c.id === current.parent_id);
      if (!parent) break;
      depth++;
      current = parent;
    }

    return depth;
  }

  const depth = getDepth(category);

  const parentName =
    categories.find((c) => c.id === category.parent_id)?.name ?? "Root";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-2xl w-full max-w-md space-y-6 shadow-2xl border border-border">
        
        {/* Header */}
        <h2 className="font-serif text-xl">Category Details</h2>

        {/* Content */}
        <div className="space-y-4 text-sm">

          {/* ID Section (Improved UI) */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">
              Category ID
            </span>

            <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-lg">
              <span className="font-mono text-xs break-all text-foreground">
                {category.id}
              </span>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-muted transition"
                title="Copy Category ID"
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4 text-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <p><strong>Name:</strong></p>
            <p>{category.name}</p>

            <p><strong>Slug:</strong></p>
            <p className="text-muted-foreground">{category.slug}</p>

            <p><strong>Parent:</strong></p>
            <p>{parentName}</p>

            <p><strong>Level:</strong></p>
            <p>{depth}</p>

            <p><strong>Direct Sub-Categories:</strong></p>
            <p>{directChildren.length}</p>

            <p><strong>Total Nested Sub-Categories:</strong></p>
            <p>{totalDescendants}</p>

            <p><strong>Products in this Category:</strong></p>
            <p>{productCount}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl hover:bg-muted transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
