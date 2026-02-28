"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  product_images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

interface Props {
  categoryId: string;
  currentProductId: string;
}

export default function SimilarProducts({
  categoryId,
  currentProductId,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products/similar/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered =
          data.products?.filter(
            (p: Product) => p.id !== currentProductId
          ) || [];

        setProducts(filtered.slice(0, 4));
      });
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-serif mb-8">
        You May Also Like
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const image =
            product.product_images?.find(
              (img) => img.is_primary
            )?.image_url ||
            product.product_images?.[0]?.image_url;

          const price =
            product.discount_price ?? product.price;

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group border rounded-2xl p-4 hover:shadow-lg transition"
            >
              <div className="aspect-square mb-4 overflow-hidden rounded-xl">
                <AppImage
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <h3 className="text-sm font-medium mb-2">
                {product.name}
              </h3>

              <p className="font-serif text-lg">
                ₹{price}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
