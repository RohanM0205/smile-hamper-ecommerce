import { supabaseServer } from "@/lib/supabase/server";
import CustomizationForm from "@/app/admin/products/[id]/customization/CustomizationForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductCustomizationPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await supabaseServer();

  const [
    { data: product },
    { data: customizationFields },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, allow_customization")
      .eq("id", id)
      .single(),

    supabase
      .from("product_customization_fields")
      .select("*")
      .eq("product_id", id)
      .order("sort_order"),
  ]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <CustomizationForm
        product={product}
        existingFields={customizationFields ?? []}
      />
    </div>
  );
}
