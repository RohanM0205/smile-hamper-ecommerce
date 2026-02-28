"use client";

import { useState } from "react";
import Icon from "@/components/ui/AppIcon";

interface UploadedImage {
  url: string;
  is_primary: boolean;
}

export default function ProductImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(files: FileList | null) {
    if (!files) return;

    setUploading(true);

    const uploaded: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      uploaded.push({
        url: data.secure_url,
        is_primary: false,
      });
    }

    // First image = primary (if none exists)
    if (!images.some((img) => img.is_primary) && uploaded.length > 0) {
      uploaded[0].is_primary = true;
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
  }

  function setPrimary(index: number) {
    onChange(
      images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Product Images</label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {uploading && <p className="text-sm">Uploading images…</p>}

      <div className="grid grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative group">
            <img
              src={img.url}
              className="w-full h-24 object-cover rounded-lg border"
            />

            {img.is_primary && (
              <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                Primary
              </span>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
              <button
                type="button"
                onClick={() => setPrimary(i)}
                className="bg-white p-1 rounded"
              >
                <Icon name="StarIcon" size={16} />
              </button>

              <button
                type="button"
                onClick={() => removeImage(i)}
                className="bg-white p-1 rounded text-error"
              >
                <Icon name="TrashIcon" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
