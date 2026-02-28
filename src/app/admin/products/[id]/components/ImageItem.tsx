"use client";

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface ImageItemProps {
  image: ProductImage;
  onPrimary: () => void;
  onDelete: () => void;
}

export default function ImageItem({
  image,
  onPrimary,
  onDelete,
}: ImageItemProps) {
  return (
    <div className="relative border rounded-xl overflow-hidden group">
      <img
        src={image.image_url}
        alt="Product"
        className="w-full h-32 object-cover"
      />

      {image.is_primary && (
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
          Primary
        </span>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
        {!image.is_primary && (
          <button
            onClick={onPrimary}
            className="px-2 py-1 bg-white text-xs rounded"
          >
            Set Primary
          </button>
        )}

        <button
          onClick={onDelete}
          className="px-2 py-1 bg-red-600 text-white text-xs rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
