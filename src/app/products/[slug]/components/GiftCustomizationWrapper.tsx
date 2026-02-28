"use client";

import { useState, useEffect } from "react";
import AddToCartButton from "./AddToCartButton";
import DynamicCustomizationForm from "@/app/products/[slug]/components/DynamicCustomizationForm";
import { Wand2 } from "lucide-react";

interface Field {
  id: string;
  field_type: "text" | "image";
  label: string;
  max_length: number | null;
  sort_order: number;
}

interface Props {
  productId: string;
  isOutOfStock: boolean;
  allowCustomization: boolean;
  customizationFields: Field[];
  slug: string;
}

export default function GiftCustomizationWrapper({
  productId,
  isOutOfStock,
  allowCustomization,
  customizationFields,
}: Props) {
  const [customizationData, setCustomizationData] =
    useState<Record<string, any> | null>(null);

  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">

      {allowCustomization && (
        <div className="rounded-3xl 
                        bg-gradient-to-br from-[#f8f4ef] to-white
                        p-6 sm:p-8
                        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
                        border border-[#e8ded2]">

<div className="flex items-center gap-3 mb-6">

<div className="w-9 h-9 flex items-center justify-center 
                rounded-xl 
                bg-gradient-to-br 
                from-[#f3ece5] to-[#e8ded2]
                text-[#7B4F2A]">
  <Wand2 size={18} />
</div>

<h3 className="text-xl font-serif text-[#5a3e2b] tracking-tight">
  Customize Your Product
</h3>

</div>

<div className="h-px bg-[#e8ded2] mb-8" />

          <DynamicCustomizationForm
            fields={customizationFields}
            onChange={(data: Record<string, any>) =>
              setCustomizationData(data)
            }
          />
        </div>
      )}

      {/* ✅ Render sticky only after mount */}
      <div
        className={`${
          mounted
            ? "sticky bottom-0 bg-white/90 backdrop-blur-md p-4"
            : ""
        } sm:static sm:bg-transparent sm:p-0`}
      >
        <AddToCartButton
          productId={productId}
          disabled={isOutOfStock}
          customization={customizationData ?? undefined}
        />
      </div>

    </div>
  );
}