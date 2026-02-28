"use client";

import React, { useState, useMemo } from "react";
import Icon from "@/components/ui/AppIcon";
import CategoryForm from "./CategoryForm";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoryDetailsModal from "./CategoryDetailsModal";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export default function CategoriesClient({
  categories,
  productCountMap,
}: {
  categories: Category[];
  productCountMap: Record<string, number>;
}) {
  const PAGE_SIZE = 25;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;

    const matches = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.includes(search)
    );

    const includeIds = new Set<string>();

    function includeParents(cat: Category) {
      includeIds.add(cat.id);
      if (cat.parent_id) {
        const parent = categories.find((x) => x.id === cat.parent_id);
        if (parent) includeParents(parent);
      }
    }

    matches.forEach(includeParents);

    return categories.filter((c) => includeIds.has(c.id));
  }, [search, categories]);

  const rootNodes = filtered.filter((c) => c.parent_id === null);

  const paginatedRoots =
    search.trim() === ""
      ? rootNodes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      : rootNodes;

  function buildTree(parentId: string | null): Category[] {
    return filtered.filter((c) => c.parent_id === parentId);
  }

  function renderRows(parentId: string | null, level = 0): React.ReactNode[] {
    const list = parentId === null ? paginatedRoots : buildTree(parentId);

    return list.map((c) => {
      const children = buildTree(c.id);
      const isOpen = expanded[c.id] || search !== "";

      return (
        <React.Fragment key={c.id}>
          <tr className="border-t border-border">
            <td className="px-6 py-4">
              <div
                style={{ paddingLeft: level * 20 }}
                className="flex items-center gap-2"
              >
                {children.length > 0 && (
                  <button
                    onClick={() => toggle(c.id)}
                    className="text-muted-foreground"
                  >
                    {isOpen ? "▼" : "▶"}
                  </button>
                )}
                {c.name}
              </div>
            </td>

            <td className="px-6 py-4 text-muted-foreground">{c.slug}</td>

            <td className="px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setEditingCategory(c);
                  setShowForm(true);
                }}
                className="text-primary"
              >
                <Icon name="PencilIcon" size={18} />
              </button>

              <button
                onClick={() => setViewingCategory(c)}
                className="text-muted-foreground"
              >
                <Icon name="EyeIcon" size={18} />
              </button>

              <button
                onClick={() => setDeletingCategory(c)}
                className="text-error"
              >
                <Icon name="TrashIcon" size={18} />
              </button>
            </td>
          </tr>

          {isOpen && renderRows(c.id, level + 1)}
        </React.Fragment>
      );
    });
  }

  const totalPages = Math.ceil(rootNodes.length / PAGE_SIZE);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-serif text-2xl">Categories</h2>

          <button
            onClick={() => {
              setEditingCategory(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl"
          >
            <Icon name="PlusIcon" size={18} />
            Add Category
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <input
            placeholder="Search category name or id..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border rounded-xl px-4 py-2"
          />
        </div>

        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Slug</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>{renderRows(null)}</tbody>
        </table>

        {search === "" && (
          <div className="p-4 flex justify-end gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <span className="px-2 text-sm">
              Page {page} / {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryModal
          categoryId={deletingCategory.id}
          onClose={() => setDeletingCategory(null)}
        />
      )}

      {viewingCategory && (
        <CategoryDetailsModal
          category={viewingCategory}
          categories={categories}
          productCount={productCountMap[viewingCategory.id] ?? 0}
          onClose={() => setViewingCategory(null)}
        />
      )}
    </>
  );
}
