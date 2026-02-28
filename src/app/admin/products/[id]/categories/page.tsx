"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { updateProductCategories } from "@/app/admin/products/actions/updateProductCategories";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
}

export default function ProductCategoriesPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- Load Product ---------------- */
  useEffect(() => {
    async function loadProduct() {
      const { data } = await supabase
        .from("products")
        .select("id,name,price,category_id")
        .eq("id", id)
        .single();

      setProduct(data);
    }

    loadProduct();
  }, [id]);

  /* ---------------- Load Categories ---------------- */
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      setCategories(data || []);
    }

    loadCategories();
  }, []);

  /* ---------------- Load Product Categories ---------------- */
  useEffect(() => {
    async function loadProductCategories() {
      const { data } = await supabase
        .from("product_categories")
        .select("category_id")
        .eq("product_id", id);

      const ids = data?.map((d) => d.category_id) || [];
      setSelected(ids);
    }

    loadProductCategories();
  }, [id]);

  /* ---------------- Toggle Category ---------------- */
  const toggleCategory = (cid: string) => {
    if (!product) return;

    if (product.category_id === cid) return;

    setSelected((prev) =>
      prev.includes(cid)
        ? prev.filter((c) => c !== cid)
        : [...prev, cid]
    );
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (!product) return;

    setLoading(true);

    try {
      const finalSelection = new Set(selected);

      if (product.category_id) {
        finalSelection.add(product.category_id);
      }

      await updateProductCategories(
        product.id,
        Array.from(finalSelection)
      );

      alert("Categories updated successfully");
      router.push(`/admin/products/${product.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update categories");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Filter ---------------- */
  const filtered = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.id.includes(search)
  );

  const primaryCategory = categories.find(
    (c) => c.id === product?.category_id
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-[#6d4f3b] hover:underline"
      >
        ← Back to Product
      </button>

      {/* Product Info */}
      {product && (
        <div className="p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border">
          <h2 className="text-2xl font-semibold">
            {product.name}
          </h2>
          <p className="text-sm text-[#6d4f3b] mt-2">
            ₹{product.price}
          </p>
        </div>
      )}

      {/* Primary Category */}
      {primaryCategory && (
        <div className="p-6 bg-[#fff8f3] border rounded-2xl shadow-sm">
          <h3 className="text-sm font-medium mb-3">
            Primary Category (Locked)
          </h3>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#8b6b55] text-white text-sm font-medium">
            {primaryCategory.name}
          </div>
        </div>
      )}

      {/* Selected Categories */}
      {selected.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border shadow-sm">
          <h3 className="text-sm font-medium mb-4">
            Selected Categories
          </h3>

          <div className="flex flex-wrap gap-2">
            {selected.map((cid) => {
              const cat = categories.find(
                (c) => c.id === cid
              );
              if (!cat) return null;

              return (
                <span
                  key={cid}
                  className="px-3 py-1.5 bg-[#f3ede6] text-[#8b6b55] rounded-full text-xs font-medium"
                >
                  {cat.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
        <input
          placeholder="Search category by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40"
        />

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">

          {filtered.map((cat) => {
            const isPrimary =
              product?.category_id === cat.id;
            const isChecked =
              selected.includes(cat.id) || isPrimary;

            return (
              <label
                key={cat.id}
                className={`flex items-center gap-3 p-4 rounded-xl transition cursor-pointer border
                  ${
                    isPrimary
                      ? "bg-[#f3ede6] cursor-not-allowed opacity-70"
                      : "hover:bg-[#f8f4ef]"
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isPrimary}
                  onChange={() =>
                    toggleCategory(cat.id)
                  }
                  className="accent-[#8b6b55] w-4 h-4"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {cat.id}
                  </span>
                </div>

                {isPrimary && (
                  <span className="ml-auto text-xs text-[#8b6b55] font-medium">
                    Primary
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-[#8b6b55] text-white rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Categories"}
        </button>
      </div>

    </div>
  );
}
