"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductGallery() {
  // In a real app, images would be fetched from an API
  const images = [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ];

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[selectedImage] && !images[selectedImage].startsWith('/') ? images[selectedImage] : images[selectedImage] && images[selectedImage].startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${images[selectedImage]}` : "/placeholder.svg"}
          alt={`Product image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted",
              selectedImage === index && "ring-2 ring-primary",
            )}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image && !image.startsWith('/') ? image : image && image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${image}` : "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}