"use client";

import React, { useState } from "react";
import AppImage from "@/components/ui/AppImage";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

const images: GalleryImage[] = [
{
  id: "img_1",
  url: "https://images.unsplash.com/photo-1452703417006-a00f3164fe7a",
  alt: "Deluxe chocolate hamper main view with assorted premium chocolates in elegant box"
},
{
  id: "img_2",
  url: "https://images.unsplash.com/photo-1681571507600-5c94e41a5f53",
  alt: "Close-up of individual chocolates showing variety and premium quality"
},
{
  id: "img_3",
  url: "https://img.rocket.new/generatedImages/rocket_gen_img_1f5ae64d5-1769441457690.png",
  alt: "Gift hamper packaging detail with ribbon and decorative elements"
},
{
  id: "img_4",
  url: "https://img.rocket.new/generatedImages/rocket_gen_img_1197d3c96-1769441459168.png",
  alt: "Complete hamper contents laid out showing all included items"
}];


const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted group">
        <AppImage
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

        
        {/* Zoom Hint */}
        <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur px-3 py-2 rounded-full text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Hover to zoom
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) =>
        <button
          key={image.id}
          onClick={() => setSelectedImage(image)}
          className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
          selectedImage.id === image.id ?
          "border-primary shadow-lg" :
          "border-border hover:border-primary/50"}`
          }>

            <AppImage
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover" />

          </button>
        )}
      </div>
    </div>);

};

export default ImageGallery;