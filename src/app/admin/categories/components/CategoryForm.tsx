"use client";

import { useState, FormEvent, useMemo } from "react";
import { createCategory, updateCategory } from "../actions";

interface Category {
  id: string;
  name: string;
  parent_id?: string | null;
}

export default function CategoryForm({
  category,
  categories,
  onClose,
}: {
  category?: Category | null;
  categories: Category[];
  onClose: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [parentId, setParentId] = useState<string | null>(
    category?.parent_id ?? null
  );

  /* --------------------------
     Collect all children recursively
  --------------------------*/
  function getChildrenIds(parentId: string): string[] {
    const children = categories.filter(c => c.parent_id === parentId);
    return children.flatMap(child => [
      child.id,
      ...getChildrenIds(child.id),
    ]);
  }

  const invalidIds = useMemo(() => {
    if (!category?.id) return [];
    return [category.id, ...getChildrenIds(category.id)];
  }, [category, categories]);

  const availableParents = categories.filter(
    c => !invalidIds.includes(c.id)
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (category?.id) {
      await updateCategory(category.id, name, parentId);
    } else {
      await createCategory(name, parentId);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-background p-6 rounded-2xl w-full max-w-md space-y-4">
        <h2 className="font-serif text-xl">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
            placeholder="Category name"
            required
          />

          <select
            value={parentId ?? ""}
            onChange={(e) => setParentId(e.target.value || null)}
            className="w-full border rounded-xl px-4 py-2"
          >
            <option value="">Main Category</option>

            {availableParents.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>

            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
