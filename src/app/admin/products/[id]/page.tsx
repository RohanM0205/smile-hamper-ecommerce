import { supabaseServer } from "@/lib/supabase/server";
import ProductFormPage from "./components/ProductFormPage";
import ProductImages from "./components/ProductImages";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await supabaseServer();

  const [
    { data: product },
    { data: images },
    { data: extraCategories },
    { data: customizationFields },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single(),

    supabase
      .from("product_images")
      .select("id, image_url, is_primary, sort_order")
      .eq("product_id", id)
      .order("sort_order"),

    supabase
      .from("product_categories")
      .select("category_id")
      .eq("product_id", id),

      supabase
    .from("product_customization_fields")
    .select("id")
    .eq("product_id", id),
  ]);

  if (!product) return <div>Product not found</div>;

  const categoryIds =
    extraCategories?.map((c) => c.category_id) ?? [];

  const hasCustomization =
    customizationFields && customizationFields.length > 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <Link
            href="/admin/products"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Products
          </Link>

          <h1 className="text-2xl font-semibold mt-2">
            {product.name}
          </h1>
        </div>

        <a
          href={`/products/${product.slug}`}
          target="_blank"
          className="px-5 py-2.5 border rounded-xl text-sm hover:bg-gray-50 transition"
        >
          View Public Page
        </a>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left */}
        <div className="space-y-4">
          <h2 className="font-medium text-lg">
            Product Details
          </h2>

          <ProductFormPage
  product={product}
  hasCustomization={hasCustomization}
/>

        </div>

        {/* Right */}
        <div className="space-y-6">

          <div>
            <h2 className="font-medium text-lg mb-3">
              Product Images
            </h2>

            <ProductImages
              productId={product.id}
              images={images ?? []}
            />
          </div>

          {/* Extra Categories Display */}
          {categoryIds.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="text-sm font-medium mb-3">
                Additional Categories
              </h3>

              <div className="flex flex-wrap gap-2">
                {categoryIds.map((cid) => (
                  <span
                    key={cid}
                    className="px-3 py-1.5 bg-[#f3ede6] text-[#8b6b55] rounded-full text-xs font-medium"
                  >
                    {cid}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
