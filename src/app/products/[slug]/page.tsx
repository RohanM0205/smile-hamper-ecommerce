import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ImageGallery from "./components/ImageGallery";
import TrackRecentlyViewed from "./components/TrackRecentlyViewed";
import ProductTabs from "./components/ProductTabs";
import ProductRatingPreview from "./components/ProductRatingPreview";
import SimilarProducts from "./components/SimilarProducts";
import GiftCustomizationWrapper from "@/app/products/[slug]/components/GiftCustomizationWrapper";
import ShareButtons from "./components/ShareButtons";
import { ShieldCheck, Truck, CreditCard, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: { slug: string };
}

interface ProductImage {
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock: number;
  category_id: string;
  allow_customization: boolean;
  product_images: ProductImage[];
}

async function getProduct(rawSlug: string): Promise<Product | null> {
  const supabase = await supabaseServer();

  // ✅ Always decode incoming slug
  const slug = decodeURIComponent(rawSlug).trim();

  // Try exact match first
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      discount_price,
      stock,
      category_id,
      allow_customization,
      product_images (
        image_url,
        is_primary,
        sort_order
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle(); // ✅ safer than single()

  if (data) return data;

  // 🔥 Fallback: normalize special encoding edge cases
  const normalizedSlug = slug.replace(/%26/g, "&");

  const fallback = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      discount_price,
      stock,
      category_id,
      allow_customization,
      product_images (
        image_url,
        is_primary,
        sort_order
      )
    `)
    .eq("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle();

  return fallback.data || null;
}

async function getCustomizationFields(productId: string) {
  const supabase = await supabaseServer();

  const { data } = await supabase
    .from("product_customization_fields")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order");

  return data || [];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = params;

  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found - TheSmileHamper" };
  }

  return {
    title: `${product.name} - TheSmileHamper`,
    description: product.description ?? "",
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {

  // ✅ FIXED: removed incorrect await
  const { slug } = params;

  const product = await getProduct(slug);

  if (!product) notFound();

  const customizations = await getCustomizationFields(product.id);

  const images =
    product.product_images?.length
      ? [...product.product_images].sort(
          (a, b) => a.sort_order - b.sort_order
        )
      : [];

  const finalPrice = product.discount_price ?? product.price;

  const discountPercent =
    product.discount_price &&
    product.discount_price < product.price
      ? Math.round(
          ((product.price - product.discount_price) /
            product.price) *
            100
        )
      : null;

  const isOutOfStock = product.stock === 0;

  return (
    <>
      <Header />

      <main className="relative bg-gradient-to-b from-[#faf7f2] to-white">
        <TrackRecentlyViewed productId={product.id} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* LEFT - IMAGES */}
            <div className="w-full lg:sticky lg:top-24">
              <ImageGallery
                images={images}
                productName={product.name}
                productId={product.id}
              />
            </div>

            {/* RIGHT - PRODUCT INFO */}
            <div className="bg-white/80 backdrop-blur-xl 
                            rounded-3xl 
                            p-6 sm:p-8 md:p-10
                            shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)]
                            border border-white/40
                            transition-all duration-500">

              {/* Breadcrumb */}
              <div className="mb-8 text-sm text-gray-500">
                <div className="flex flex-wrap items-center gap-2">
                  <a href="/" className="hover:text-[#7B4F2A] transition">
                    Home
                  </a>
                  <span>/</span>
                  <a href="/shop" className="hover:text-[#7B4F2A] transition">
                    Shop
                  </a>
                  <span>/</span>
                  <span className="text-[#7B4F2A] font-medium">
                    {product.name}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl 
                             font-serif leading-tight tracking-tight 
                             mb-6 text-[#2f2f2f]">
                {product.name}
              </h1>

              <ProductRatingPreview productId={product.id} />

              <div className="mt-6 mb-6 flex flex-wrap items-center gap-4">
                <span className="text-3xl sm:text-4xl 
                                 font-semibold tracking-tight 
                                 text-[#1f1f1f]">
                  ₹{finalPrice}
                </span>

                {product.discount_price && (
                  <span className="text-lg line-through text-gray-400">
                    ₹{product.price}
                  </span>
                )}

                {discountPercent && (
                  <span className="px-3 py-1.5 
                                   rounded-full 
                                   bg-[#f3ece5] text-[#7B4F2A]
                                   text-sm font-medium
                                   border border-[#e8ded2]">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <ShareButtons productName={product.name} />

              <div className="mt-6 mb-6 text-sm sm:text-base font-medium">
                {product.stock === 0 ? (
                  <p className="text-red-600">Out of Stock</p>
                ) : product.stock <= 5 ? (
                  <p className="text-orange-600">
                    Only {product.stock} left — Order soon!
                  </p>
                ) : (
                  <p className="text-green-600">
                    In Stock & Ready to Ship
                  </p>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed 
                            text-sm sm:text-base 
                            mb-8">
                {product.description}
              </p>

              <GiftCustomizationWrapper
                productId={product.id}
                isOutOfStock={isOutOfStock}
                allowCustomization={product.allow_customization}
                customizationFields={customizations}
                slug={slug}
              />

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Secure Payments",
                    desc: "Encrypted & protected checkout",
                  },
                  {
                    icon: Truck,
                    title: "Fast Delivery",
                    desc: "Reliable doorstep shipping",
                  },
                  {
                    icon: CreditCard,
                    title: "COD Available",
                    desc: "Cash on delivery supported",
                  },
                  {
                    icon: Gift,
                    title: "Premium Packaging",
                    desc: "Beautiful gift-ready wrapping",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={i}
                      className="group flex items-start gap-4 
                                 p-4 rounded-2xl 
                                 bg-white/60 backdrop-blur-sm
                                 border border-[#efe5da]
                                 shadow-sm
                                 hover:shadow-md
                                 hover:-translate-y-1
                                 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center 
                                      w-11 h-11 rounded-xl 
                                      bg-gradient-to-br 
                                      from-[#f3ece5] to-[#e8ded2]
                                      text-[#7B4F2A]
                                      group-hover:scale-110
                                      transition">
                        <Icon size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-[#4a3a2d] text-sm sm:text-base">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          <div className="mt-20">
            <ProductTabs
              productId={product.id}
              description={product.description}
            />
          </div>

          <div className="mt-20">
            <SimilarProducts
              categoryId={product.category_id}
              currentProductId={product.id}
            />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}