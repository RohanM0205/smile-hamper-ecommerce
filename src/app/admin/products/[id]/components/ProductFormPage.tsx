"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { updateProduct } from "../../actions/updateProduct";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  category_id: string | null;
  tags?: string[] | null; // ✅ Added
}

export default function ProductFormPage({
  product,
  hasCustomization,
}: {
  product: Product;
  hasCustomization?: boolean | null;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState<Product>({
    ...product,
    tags: product.tags ?? null, // ensure correct default
  });

  const [categoryInput, setCategoryInput] =
    useState(product.category_id ?? "");
  const [categoryName, setCategoryName] =
    useState<string | null>(null);

  /* ---------------------------
     Load category name initially
  --------------------------- */
  useEffect(() => {
    if (product.category_id) {
      fetchCategory(product.category_id);
    }
  }, []);

  /* ---------------------------
     Fetch Category
  --------------------------- */
  async function fetchCategory(id?: string) {
    const cid = id ?? categoryInput;
    if (!cid) return;

    setFetching(true);

    try {
      const res = await fetch(
        `/api/admin/category-by-id?id=${cid}`
      );

      if (!res.ok) {
        setCategoryName(null);
        alert("Category not found");
        return;
      }

      const json = await res.json();

      setCategoryName(json.data.name);
      setForm((prev) => ({
        ...prev,
        category_id: json.data.id,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch category");
    } finally {
      setFetching(false);
    }
  }

  /* ---------------------------
     Submit
  --------------------------- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProduct(product.id, {
        ...form,
        tags: form.tags ?? null,
      });

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------
     TAG LOGIC
  --------------------------- */
  const tagOptions = [
    "new",
    "trending",
    "best_seller",
    "sale",
    "featured",
  ];
  const selectedTags = form.tags ?? [];

  const toggleTag = (tag: string) => {
    if (tag === "NA") {
      setForm({ ...form, tags: null });
      return;
    }

    let updated = [...selectedTags];

    if (updated.includes(tag)) {
      updated = updated.filter((t) => t !== tag);
    } else {
      updated.push(tag);
    }

    if (updated.length === 0) {
      setForm({ ...form, tags: null });
    } else {
      setForm({ ...form, tags: updated });
    }
  };

  const isNASelected = !form.tags || form.tags.length === 0;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Header */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Product
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update product details, pricing, stock and category.
          </p>
        </div>

        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700">
            Basic Information
          </h3>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Product Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700">
            Category
          </h3>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Category ID
            </label>

            <div className="flex flex-col md:flex-row gap-3 mt-2">
              <input
                value={categoryInput}
                onChange={(e) =>
                  setCategoryInput(e.target.value)
                }
                placeholder="Enter category id"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
              />

              <button
                type="button"
                onClick={() => fetchCategory()}
                className="px-5 py-3 bg-[#f3ede6] text-[#8b6b55] rounded-xl hover:bg-[#e9e1d8] transition font-medium"
              >
                {fetching ? "Fetching..." : "Fetch"}
              </button>
            </div>

            {categoryName && (
              <div className="mt-3 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                Selected:{" "}
                <span className="font-medium">
                  {categoryName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* TAG SECTION (ADDED) */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700">
            Product Tags
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <label className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={isNASelected}
                onChange={() => toggleTag("NA")}
                className="w-4 h-4 accent-[#8b6b55]"
              />
              <span className="text-sm font-medium">
                NA (No Tag)
              </span>
            </label>

            {tagOptions.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                  className="w-4 h-4 accent-[#8b6b55]"
                />
                <span className="text-sm font-medium capitalize">
                {tag
  .replace("_", " ")
  .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Pricing & Stock (UNCHANGED) */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700">
            Pricing & Stock
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Price
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Discount Price
              </label>
              <input
                type="number"
                value={form.discount_price ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    discount_price:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  }))
                }
                className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Stock Quantity
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  stock: Number(e.target.value),
                }))
              }
              className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>

          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="w-4 h-4 accent-[#8b6b55]"
            />
            Active product
          </label>
        </div>

        {/* Actions (UNCHANGED) */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t">

  <div className="flex flex-col md:flex-row gap-4">

    {/* Manage Categories */}
    <button
      type="button"
      onClick={() =>
        router.push(
          `/admin/products/${product.id}/categories`
        )
      }
      className="px-6 py-3 border border-[#8b6b55] text-[#8b6b55] rounded-xl hover:bg-[#f3ede6] transition font-medium"
    >
      Manage Categories
    </button>

    {/* NEW Customization Button */}
    <button
      type="button"
      onClick={() =>
        router.push(
          `/admin/products/${product.id}/customization`
        )
      }
      className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium"
    >
      {hasCustomization
        ? "Update Customization"
        : "Add Customization"}
    </button>

  </div>

  <button
    type="submit"
    disabled={loading}
    className="px-8 py-3 bg-[#8b6b55] text-white rounded-xl shadow-md hover:opacity-90 transition font-medium disabled:opacity-60"
  >
    {loading ? "Saving..." : "Save Product"}
  </button>

</div>


      </form>
    </div>
  );
}
