"use client";

import { useState } from "react";
import ImageItem from "./ImageItem";
import UploadImages from "./UploadImages";
import {
  reorderImages,
  setPrimaryImage,
  deleteImage,
} from "../actions";

interface Image {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export default function ProductImages({
  productId,
  images,
}: {
  productId: string;
  images: Image[];
}) {
  const [items, setItems] = useState<Image[]>(images);

  function handleUploaded(newImages: Image[]) {
    setItems((prev) => [...prev, ...newImages]);
  }

  async function handlePrimary(imageId: string) {
    await setPrimaryImage(productId, imageId);

    // update UI instantly
    setItems((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: img.id === imageId,
      }))
    );
  }

  async function handleDelete(imageId: string) {
    await deleteImage(imageId);

    setItems((prev) => prev.filter((img) => img.id !== imageId));
  }

  return (
    <div>
      <UploadImages productId={productId} onUploaded={handleUploaded} />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground mt-4">
          No images uploaded yet
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {items.map((img) => (
            <ImageItem
              key={img.id}
              image={img}
              onPrimary={() => handlePrimary(img.id)}
              onDelete={() => handleDelete(img.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
