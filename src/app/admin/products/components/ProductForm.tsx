"use client";

import { useEffect, useState, FormEvent } from "react";
import Icon from "@/components/ui/AppIcon";
import { createProduct } from "../actions/createProduct";
import { updateProduct } from "../actions/updateProduct";
import { getCategoryById } from "../actions/getCategoryById";
import ProductImageUploader from "./ProductImageUploader";

interface ProductImage {
  image_url: string;
  is_primary?: boolean;
}

interface ProductForForm {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  category_id: string | null;
  tags: string[] | null;
}

export default function ProductForm({
  product,
  onClose,
}: {
  product?: ProductForForm | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState<ProductForForm>({
    name: "",
    description: "",
    price: 0,
    discount_price: null,
    stock: 0,
    is_active: true,
    category_id: null,
    tags: null,
  });

  const [allowCustomization, setAllowCustomization] = useState(false);

const [allowText, setAllowText] = useState(false);
const [textFields, setTextFields] = useState<
  { label: string; max_length: number }[]
>([]);

const [allowImages, setAllowImages] = useState(false);
const [imageFields, setImageFields] = useState<
  { label: string }[]
>([]);


  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        tags: product.tags ?? null,
      });

      if (product.category_id) {
        setCategoryInput(product.category_id);
      }
    }
  }, [product]);

  async function fetchCategory() {
    if (!categoryInput) return;

    setFetching(true);

    const res = await getCategoryById(categoryInput);

    if (res?.error || !res?.data) {
      alert("Category not found");
      setCategoryName(null);
    } else {
      setCategoryName(res.data.name);
      setForm({ ...form, category_id: res.data.id });
    }

    setFetching(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        tags: form.tags ?? null,
      };

      if (product?.id) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct({
          ...payload,
          images,
          allow_customization: allowCustomization,
          customization_fields: [
            ...textFields.map((f, i) => ({
              field_type: "text" as const,
              label: f.label,
              max_length: f.max_length,
              sort_order: i,
            })),
            ...imageFields.map((f, i) => ({
              field_type: "image" as const,
              label: f.label,
              max_length: null,
              sort_order: textFields.length + i,
            })),
          ],
        });
        
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
  
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
  
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b px-8 py-6 flex justify-between items-center rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage product details and configuration
            </p>
          </div>
  
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>
  
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">
  
          {/* SECTION CARD */}
          <div className="bg-gray-50/70 border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-medium text-gray-700">
              Basic Information
            </h3>
  
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Product name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
            />
  
            <textarea
              rows={4}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Product description"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
            />
          </div>
  
          {/* CATEGORY */}
          <div className="bg-gray-50/70 border rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              Category
            </h3>
  
            <div className="flex gap-3">
              <input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Enter category ID"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
              />
  
              <button
                type="button"
                onClick={fetchCategory}
                className="px-5 py-3 bg-[#8b6b55] text-white rounded-xl hover:opacity-90 transition font-medium disabled:opacity-60"
              >
                {fetching ? "Fetching..." : "Fetch"}
              </button>
            </div>
  
            {categoryName && (
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                Selected Category:{" "}
                <span className="font-medium">{categoryName}</span>
              </div>
            )}
          </div>
  
          {/* TAG */}
          {/* TAG */}
<div className="bg-gray-50/70 border rounded-2xl p-6 space-y-5">
  <h3 className="text-lg font-medium text-gray-700">
    Product Tags
  </h3>

  {(() => {
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
        // NA selected → clear all
        setForm({ ...form, tags: null });
        return;
      }

      let updated = [...selectedTags];

      if (updated.includes(tag)) {
        updated = updated.filter((t) => t !== tag);
      } else {
        updated.push(tag);
      }

      // If empty → null
      if (updated.length === 0) {
        setForm({ ...form, tags: null });
      } else {
        setForm({ ...form, tags: updated });
      }
    };

    const isNASelected = !form.tags || form.tags.length === 0;

    return (
      <div className="grid grid-cols-2 gap-4">

        {/* NA OPTION */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-white border cursor-pointer hover:bg-gray-50 transition">
          <input
            type="checkbox"
            checked={isNASelected}
            onChange={() => toggleTag("NA")}
            className="w-4 h-4 accent-[#8b6b55]"
          />
          <span className="text-sm font-medium text-gray-700">
            NA (No Tag)
          </span>
        </label>

        {/* REAL TAGS */}
        {tagOptions.map((tag) => {
          const checked = selectedTags.includes(tag);

          return (
            <label
              key={tag}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleTag(tag)}
                className="w-4 h-4 accent-[#8b6b55]"
              />
              <span className="text-sm capitalize font-medium text-gray-700">
              {tag.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </label>
          );
        })}
      </div>
    );
  })()}
</div>

  
          {/* IMAGES */}
          {!product && (
            <div className="bg-gray-50/70 border rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Product Images
              </h3>
  
              <ProductImageUploader
                images={images.map((i) => ({
                  url: i.image_url,
                  is_primary: i.is_primary ?? false,
                }))}
                onChange={(imgs) =>
                  setImages(
                    imgs.map((i) => ({
                      image_url: i.url,
                      is_primary: i.is_primary,
                    }))
                  )
                }
              />
            </div>
          )}
  
          {/* PRICING */}
          <div className="bg-gray-50/70 border rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-medium text-gray-700">
              Pricing & Stock
            </h3>
  
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
              />
  
              <input
                type="number"
                placeholder="Discount Price"
                value={form.discount_price ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discount_price:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  })
                }
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
              />
            </div>
  
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
              placeholder="Stock quantity"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6b55]/40 transition"
            />
  
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
                className="w-4 h-4 accent-[#8b6b55]"
              />
              <span className="text-gray-700">Active product</span>
            </label>
          </div>
          {/* ---------------- CUSTOMIZATION ---------------- */}
<div className="pt-4 border-t space-y-4">

<label className="flex items-center gap-3 text-sm cursor-pointer">
  <input
    type="checkbox"
    checked={allowCustomization}
    onChange={(e) => setAllowCustomization(e.target.checked)}
    className="w-4 h-4 accent-[#8b6b55]"
  />
  <span className="text-gray-700 font-medium">
    Allow Customization
  </span>
</label>

{allowCustomization && (
  <div className="space-y-6 pl-6">

    {/* TEXT CUSTOMIZATION */}
    <div className="space-y-3">
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={allowText}
          onChange={(e) => {
            setAllowText(e.target.checked);
            if (!e.target.checked) setTextFields([]);
          }}
          className="w-4 h-4 accent-[#8b6b55]"
        />
        <span className="text-gray-700 font-medium">
          Text Fields
        </span>
      </label>

      {allowText && (
        <>
          <input
            type="number"
            min={1}
            max={10}
            placeholder="Number of text fields (max 10)"
            onChange={(e) => {
              const count = Number(e.target.value);
              if (count > 10) return;
              setTextFields(
                Array.from({ length: count }, () => ({
                  label: "",
                  max_length: 50,
                }))
              );
            }}
            className="px-4 py-2 border rounded-xl w-full"
          />

          {textFields.map((field, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <input
                placeholder={`Field ${index + 1} Label`}
                value={field.label}
                onChange={(e) => {
                  const updated = [...textFields];
                  updated[index].label = e.target.value;
                  setTextFields(updated);
                }}
                className="px-4 py-2 border rounded-xl"
              />

              <input
                type="number"
                placeholder="Max Length"
                value={field.max_length}
                onChange={(e) => {
                  const updated = [...textFields];
                  updated[index].max_length = Number(e.target.value);
                  setTextFields(updated);
                }}
                className="px-4 py-2 border rounded-xl"
              />
            </div>
          ))}
        </>
      )}
    </div>

    {/* IMAGE CUSTOMIZATION */}
    <div className="space-y-3">
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={allowImages}
          onChange={(e) => {
            setAllowImages(e.target.checked);
            if (!e.target.checked) setImageFields([]);
          }}
          className="w-4 h-4 accent-[#8b6b55]"
        />
        <span className="text-gray-700 font-medium">
          Image Fields
        </span>
      </label>

      {allowImages && (
        <>
          <input
            type="number"
            min={1}
            max={7}
            placeholder="Number of image fields (max 7)"
            onChange={(e) => {
              const count = Number(e.target.value);
              if (count > 7) return;
              setImageFields(
                Array.from({ length: count }, () => ({
                  label: "",
                }))
              );
            }}
            className="px-4 py-2 border rounded-xl w-full"
          />

          {imageFields.map((field, index) => (
            <input
              key={index}
              placeholder={`Image Field ${index + 1} Label`}
              value={field.label}
              onChange={(e) => {
                const updated = [...imageFields];
                updated[index].label = e.target.value;
                setImageFields(updated);
              }}
              className="px-4 py-2 border rounded-xl w-full"
            />
          ))}
        </>
      )}
    </div>
  </div>
)}
</div>

  
          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
  
            <button
              disabled={loading}
              className="px-8 py-3 bg-[#8b6b55] text-white rounded-xl shadow-md hover:opacity-90 transition font-medium disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
  
        </form>
      </div>
    </div>
  );
  
}
