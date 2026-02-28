"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";
import ProductForm from "./ProductForm";
import DeleteProductModal from "./DeleteProductModal";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  category_id: string | null;
  categoryName: string;
  primaryImage: string | null;
}

export default function AdminProductsClient({
  products,
  categories,
  currentPage,
  totalPages,
}: {
  products: Product[];
  categories: Category[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [showProductForm, setShowProductForm] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  /* ---------------- FILTER STATE ---------------- */
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [status, setStatus] = useState(params.get("status") ?? "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [minStock, setMinStock] = useState(params.get("minStock") ?? "");
  const [maxStock, setMaxStock] = useState(params.get("maxStock") ?? "");

  /* ---------------- DEBOUNCED APPLY ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams();

      if (search) newParams.set("search", search);
      if (category) newParams.set("category", category);
      if (status) newParams.set("status", status);
      if (minPrice) newParams.set("minPrice", minPrice);
      if (maxPrice) newParams.set("maxPrice", maxPrice);
      if (minStock) newParams.set("minStock", minStock);
      if (maxStock) newParams.set("maxStock", maxStock);

      newParams.set("page", "1");

      router.push(`/admin/products?${newParams.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, category, status, minPrice, maxPrice, minStock, maxStock]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setStatus("");
    setMinPrice("");
    setMaxPrice("");
    setMinStock("");
    setMaxStock("");
    router.push("/admin/products");
  }

  function goPage(page: number) {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", page.toString());
    router.push(`/admin/products?${newParams.toString()}`);
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-border flex flex-col gap-4">

          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl">Products</h2>

            <button
              onClick={() => setShowProductForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl"
            >
              <Icon name="PlusIcon" size={18} />
              Add Product
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3">

            <input
              placeholder="Search product name / id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border rounded-xl"
            />

            <input
              placeholder="Category name / id"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border rounded-xl"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border rounded-xl"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <input
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-3 py-2 border rounded-xl w-28"
            />

            <input
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-3 py-2 border rounded-xl w-28"
            />

            <input
              placeholder="Min Stock"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              className="px-3 py-2 border rounded-xl w-28"
            />

            <input
              placeholder="Max Stock"
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
              className="px-3 py-2 border rounded-xl w-28"
            />

            <button
              onClick={clearFilters}
              className="px-4 py-2 border rounded-xl text-sm"
            >
              Clear Filters
            </button>
          </div>

          {/* FILTER CHIPS */}
          <div className="flex gap-2 flex-wrap">
            {status && <span className="px-3 py-1 bg-muted rounded-full text-sm">Status: {status}</span>}
            {minPrice && <span className="px-3 py-1 bg-muted rounded-full text-sm">Min Price: {minPrice}</span>}
            {maxPrice && <span className="px-3 py-1 bg-muted rounded-full text-sm">Max Price: {maxPrice}</span>}
            {minStock && <span className="px-3 py-1 bg-muted rounded-full text-sm">Min Stock: {minStock}</span>}
            {maxStock && <span className="px-3 py-1 bg-muted rounded-full text-sm">Max Stock: {maxStock}</span>}
            {category && <span className="px-3 py-1 bg-muted rounded-full text-sm">Category: {category}</span>}
          </div>

        </div>

        {/* TABLE */}
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-6 py-4 flex items-center gap-4">
                  {p.primaryImage
                    ? <img src={p.primaryImage} className="w-12 h-12 rounded-lg object-cover"/>
                    : <div className="w-12 h-12 bg-muted rounded-lg" />
                  }
                  <span>{p.name}</span>
                </td>

                <td className="px-6 py-4">₹{p.discount_price ?? p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">{p.categoryName}</td>
                <td className="px-6 py-4">{p.is_active ? "Active" : "Inactive"}</td>

                <td className="px-6 py-4 flex gap-3">
                  <Link href={`/admin/products/${p.id}`}>
                    <Icon name="PencilIcon" size={18}/>
                  </Link>
                  <button onClick={() => setDeletingProduct(p)}>
                    <Icon name="TrashIcon" size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 p-4">
          <button disabled={currentPage <= 1} onClick={() => goPage(currentPage - 1)}>
            Prev
          </button>

          <span>Page {currentPage} / {totalPages}</span>

          <button disabled={currentPage >= totalPages} onClick={() => goPage(currentPage + 1)}>
            Next
          </button>
        </div>
      </div>

      {showProductForm && (
        <ProductForm product={null} onClose={() => setShowProductForm(false)} />
      )}

      {deletingProduct && (
        <DeleteProductModal
          productId={deletingProduct.id}
          onClose={() => setDeletingProduct(null)}
        />
      )}
    </>
  );
}
