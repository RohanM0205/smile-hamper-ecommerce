"use client";

import { useState, useEffect } from "react";

interface Customization {
  id: string;
  type: string; // text | textarea | select
  label: string;
  required: boolean;
  options?: string[];
}

interface Props {
  customizations: Customization[];
  hasAdvancedCustomization: boolean;
  onChange?: (values: any) => void;
}

export default function GiftCustomization({
  customizations,
  hasAdvancedCustomization,
  onChange,
}: Props) {
  const [values, setValues] = useState<any>({
    giftMessage: "",
    deliveryDate: "",
    giftWrap: false,
    advanced: {},
  });

  /* ================= PROPAGATE VALUES ================= */

  useEffect(() => {
    onChange?.(values);
  }, [values, onChange]);

  /* ================= HANDLERS ================= */

  const updateBasicField = (key: string, value: any) => {
    setValues((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateAdvancedField = (fieldId: string, value: any) => {
    setValues((prev: any) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [fieldId]: value,
      },
    }));
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 mb-8 rounded-3xl p-6 sm:p-8 
                    bg-gradient-to-br from-[#f8f4ef] to-white
                    shadow-[0_15px_50px_-15px_rgba(0,0,0,0.15)]
                    border border-[#e8ded2]">

      <h3 className="font-serif text-2xl text-[#5a3e2b]">
        🎁 Personalize Your Gift
      </h3>

      {/* 🎀 Gift Message */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#5a3e2b]">
          Gift Message
        </label>
        <textarea
          className="w-full rounded-xl border border-[#e0d4c7] bg-white/70
                     px-4 py-3 text-sm
                     focus:outline-none focus:ring-2 
                     focus:ring-[#7B4F2A]/40
                     transition"
          placeholder="Write a heartfelt message..."
          value={values.giftMessage}
          onChange={(e) =>
            updateBasicField("giftMessage", e.target.value)
          }
        />
      </div>

      {/* 📅 Delivery Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#5a3e2b]">
          Preferred Delivery Date
        </label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-xl border border-[#e0d4c7] bg-white/70
                     px-4 py-3 text-sm
                     focus:outline-none focus:ring-2 
                     focus:ring-[#7B4F2A]/40
                     transition"
          value={values.deliveryDate}
          onChange={(e) =>
            updateBasicField("deliveryDate", e.target.value)
          }
        />
      </div>

      {/* 🎁 Gift Wrap */}
      <div className="flex items-center justify-between 
                      bg-white/60 rounded-xl px-4 py-3 
                      border border-[#e0d4c7]">
        <div>
          <p className="font-medium text-[#5a3e2b]">
            Add Premium Gift Wrap
          </p>
          <p className="text-xs text-gray-500">
            Beautifully wrapped with care
          </p>
        </div>

        <input
          type="checkbox"
          checked={values.giftWrap}
          onChange={(e) =>
            updateBasicField("giftWrap", e.target.checked)
          }
          className="w-5 h-5 accent-[#7B4F2A]"
        />
      </div>

      {/* 🔥 Advanced Customizations */}
      {hasAdvancedCustomization &&
        customizations?.length > 0 && (
          <>
            <div className="border-t border-[#e5d8ca] pt-6 space-y-6">

              <h4 className="text-lg font-semibold text-[#5a3e2b]">
                Product Customization
              </h4>

              {customizations.map((field) => (
                <div key={field.id} className="space-y-2">

                  <label className="block text-sm font-medium text-[#5a3e2b]">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {/* TEXT */}
                  {field.type === "text" && (
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#e0d4c7] bg-white/70
                                 px-4 py-3 text-sm
                                 focus:outline-none focus:ring-2 
                                 focus:ring-[#7B4F2A]/40
                                 transition"
                      onChange={(e) =>
                        updateAdvancedField(
                          field.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {/* TEXTAREA */}
                  {field.type === "textarea" && (
                    <textarea
                      className="w-full rounded-xl border border-[#e0d4c7] bg-white/70
                                 px-4 py-3 text-sm
                                 focus:outline-none focus:ring-2 
                                 focus:ring-[#7B4F2A]/40
                                 transition"
                      onChange={(e) =>
                        updateAdvancedField(
                          field.id,
                          e.target.value
                        )
                      }
                    />
                  )}

                  {/* SELECT */}
                  {(field.type === "select" ||
                    field.type === "dropdown") && (
                    <select
                      defaultValue=""
                      className="w-full rounded-xl border border-[#e0d4c7] bg-white/70
                                 px-4 py-3 text-sm
                                 focus:outline-none focus:ring-2 
                                 focus:ring-[#7B4F2A]/40
                                 transition"
                      onChange={(e) =>
                        updateAdvancedField(
                          field.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="" disabled>
                        Select option
                      </option>

                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
}