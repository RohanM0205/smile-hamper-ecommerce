"use client";

import { useEffect, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface Field {
  id: string;
  field_type: "text" | "image";
  label: string;
  max_length: number | null;
}

interface Props {
  fields: Field[];
  onChange: (data: any) => void;
}

export default function DynamicCustomizationForm({
  fields,
  onChange,
}: Props) {
  const [giftMessage, setGiftMessage] = useState("");
  const [fieldValues, setFieldValues] =
    useState<Record<string, any>>({});
  const [uploading, setUploading] =
    useState<Record<string, boolean>>({});

  /* Send clean data to parent */
  useEffect(() => {
    const cleanedFields = Object.fromEntries(
      Object.entries(fieldValues).map(
        ([key, value]) => [
          key,
          typeof value === "object"
            ? value.url
            : value,
        ]
      )
    );

    onChange({
      giftMessage,
      fields: cleanedFields,
    });
  }, [giftMessage, fieldValues]);

  /* Cloudinary Upload */
  const uploadToCloudinary = async (
    file: File
  ) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      "unsigned_products"
    );
    formData.append(
      "folder",
      "TheSmileHamper/Customization_Users"
    );
    formData.append(
      "public_id",
      `user_${Date.now()}_${file.name.replace(
        /\s+/g,
        "_"
      )}`
    );

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmjds6upr/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    return data.secure_url;
  };

  const handleImageUpload = async (
    fieldId: string,
    file: File
  ) => {
    try {
      setUploading((prev) => ({
        ...prev,
        [fieldId]: true,
      }));

      const previewUrl =
        URL.createObjectURL(file);

      setFieldValues((prev) => ({
        ...prev,
        [fieldId]: {
          preview: previewUrl,
          url: null,
        },
      }));

      const uploadedUrl =
        await uploadToCloudinary(file);

      setFieldValues((prev) => ({
        ...prev,
        [fieldId]: {
          preview: uploadedUrl,
          url: uploadedUrl,
        },
      }));
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading((prev) => ({
        ...prev,
        [fieldId]: false,
      }));
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm space-y-8">

      {/* Header */}
      <div>
        <h5 className="text-lg sm:text-xl font-semibold">
        Add a special touch to make it memorable.
        </h5>
        
      </div>

      {/* Gift Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Gift Message
        </label>

        <textarea
          className="w-full rounded-xl border border-gray-300 
                     bg-white p-3 text-sm sm:text-base
                     focus:outline-none focus:ring-2 focus:ring-black/20
                     transition resize-none"
          rows={4}
          placeholder="Write your special message..."
          value={giftMessage}
          onChange={(e) =>
            setGiftMessage(e.target.value)
          }
        />
      </div>

      {/* Dynamic Fields */}
      {fields.map((field) => (
        <div key={field.id} className="space-y-3">
          <label className="text-sm font-medium">
            {field.label}
          </label>

          {/* TEXT FIELD */}
          {field.field_type === "text" && (
            <input
              type="text"
              maxLength={
                field.max_length ?? undefined
              }
              className="w-full rounded-xl border border-gray-300 
                         bg-white p-3 text-sm sm:text-base
                         focus:outline-none focus:ring-2 focus:ring-black/20
                         transition"
              placeholder="Enter text here"
              onChange={(e) =>
                setFieldValues((prev) => ({
                  ...prev,
                  [field.id]: e.target.value,
                }))
              }
            />
          )}

          {/* IMAGE FIELD */}
          {field.field_type === "image" && (
            <div className="space-y-4">

              <label className="flex flex-col items-center justify-center 
                                gap-2 border-2 border-dashed 
                                border-gray-300 rounded-xl 
                                p-6 cursor-pointer 
                                hover:border-black/40 hover:bg-gray-50 
                                transition text-sm text-gray-600">

                <Upload size={20} />
                <span>Click to upload image</span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    handleImageUpload(
                      field.id,
                      e.target.files[0]
                    );
                  }}
                />
              </label>

              {uploading[field.id] && (
                <p className="text-sm text-gray-500">
                  Uploading image...
                </p>
              )}

              {fieldValues[field.id]?.preview && (
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border shadow-sm">
                    <img
                      src={
                        fieldValues[field.id]
                          .preview
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ImageIcon size={16} />
                    Image uploaded
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
