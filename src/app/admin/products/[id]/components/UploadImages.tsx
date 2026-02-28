"use client";

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import { insertProductImage } from "../actions";

interface UploadImagesProps {
  productId: string;
  onUploaded: (images: ProductImage[]) => void;
}

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export default function UploadImages({
  productId,
  onUploaded,
}: UploadImagesProps) {
  async function handleSuccess(results: CloudinaryUploadWidgetResults) {
    const info = results.info;
    if (!info || typeof info === "string") return;

    const { secure_url, public_id } = info;

    try {
      const data = await insertProductImage(
        productId,
        secure_url,
        public_id
      );

      onUploaded([data]);
    } catch (err) {
      console.error("Failed to save image:", err);
    }
  }

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
      onSuccess={handleSuccess}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="px-4 py-2 border rounded-xl text-sm"
        >
          Add Images
        </button>
      )}
    </CldUploadWidget>
  );
}
