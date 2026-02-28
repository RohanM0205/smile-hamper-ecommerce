"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "../../actions/updateProduct";

interface Field {
  id?: string;
  field_type: "text" | "image";
  label: string;
  max_length: number | null;
  sort_order: number;
}

export default function CustomizationForm({
  product,
  existingFields,
}: {
  product: any;
  existingFields: Field[];
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [allowCustomization, setAllowCustomization] =
    useState(product.allow_customization ?? false);

  const [allowText, setAllowText] = useState(false);
  const [allowImages, setAllowImages] = useState(false);

  const [textFields, setTextFields] = useState<
    { label: string; max_length: number }[]
  >([]);

  const [imageFields, setImageFields] = useState<
    { label: string }[]
  >([]);

  /* ------------------------------
     Initialize Existing Data
  ------------------------------- */
  useEffect(() => {
    if (!existingFields?.length) return;

    const text = existingFields.filter(
      (f) => f.field_type === "text"
    );

    const images = existingFields.filter(
      (f) => f.field_type === "image"
    );

    if (text.length > 0) {
      setAllowText(true);
      setTextFields(
        text.map((f) => ({
          label: f.label,
          max_length: f.max_length ?? 50,
        }))
      );
    }

    if (images.length > 0) {
      setAllowImages(true);
      setImageFields(
        images.map((f) => ({
          label: f.label,
        }))
      );
    }
  }, [existingFields]);

  /* ------------------------------
     Submit
  ------------------------------- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const customization_fields = [
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
      ];

      await updateProduct(product.id, {
        allow_customization: allowCustomization,
        customization_fields,
      });

      router.push(`/admin/products/${product.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update customization");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg space-y-8">
      <h1 className="text-2xl font-semibold">
        Customization – {product.name}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Enable Customization */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={allowCustomization}
            onChange={(e) =>
              setAllowCustomization(e.target.checked)
            }
            className="w-4 h-4"
          />
          <span className="font-medium">
            Allow Customization
          </span>
        </label>

        {allowCustomization && (
          <div className="space-y-8">

            {/* TEXT FIELDS */}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={allowText}
                  onChange={(e) => {
                    setAllowText(e.target.checked);
                    if (!e.target.checked) setTextFields([]);
                  }}
                />
                Text Fields
              </label>

              {allowText && (
                <>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    placeholder="Number of text fields"
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
                    className="border px-4 py-2 rounded-xl w-full"
                  />

                  {textFields.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-4"
                    >
                      <input
                        placeholder={`Field ${
                          index + 1
                        } Label`}
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...textFields];
                          updated[index].label =
                            e.target.value;
                          setTextFields(updated);
                        }}
                        className="border px-4 py-2 rounded-xl"
                      />

                      <input
                        type="number"
                        placeholder="Max Length"
                        value={field.max_length}
                        onChange={(e) => {
                          const updated = [...textFields];
                          updated[index].max_length =
                            Number(e.target.value);
                          setTextFields(updated);
                        }}
                        className="border px-4 py-2 rounded-xl"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* IMAGE FIELDS */}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={allowImages}
                  onChange={(e) => {
                    setAllowImages(e.target.checked);
                    if (!e.target.checked)
                      setImageFields([]);
                  }}
                />
                Image Fields
              </label>

              {allowImages && (
                <>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    placeholder="Number of image fields"
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      if (count > 7) return;

                      setImageFields(
                        Array.from({ length: count }, () => ({
                          label: "",
                        }))
                      );
                    }}
                    className="border px-4 py-2 rounded-xl w-full"
                  />

                  {imageFields.map((field, index) => (
                    <input
                      key={index}
                      placeholder={`Image Field ${
                        index + 1
                      } Label`}
                      value={field.label}
                      onChange={(e) => {
                        const updated = [...imageFields];
                        updated[index].label =
                          e.target.value;
                        setImageFields(updated);
                      }}
                      className="border px-4 py-2 rounded-xl w-full"
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/admin/products/${product.id}`
              )
            }
            className="px-6 py-3 border rounded-xl"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="px-8 py-3 bg-[#8b6b55] text-white rounded-xl"
          >
            {loading ? "Saving..." : "Save Customization"}
          </button>
        </div>
      </form>
    </div>
  );
}
