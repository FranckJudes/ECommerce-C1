"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export default function SizeSelector({  }: { productId: string }) {//productId
  // In a real app, these would be fetched from an API based on the productId
  const sizes = [
    { size: "US 7", inStock: true },
    { size: "US 7.5", inStock: true },
    { size: "US 8", inStock: true },
    { size: "US 8.5", inStock: true },
    { size: "US 9", inStock: true },
    { size: "US 9.5", inStock: true },
    { size: "US 10", inStock: true },
    { size: "US 10.5", inStock: false },
    { size: "US 11", inStock: true },
    { size: "US 11.5", inStock: false },
    { size: "US 12", inStock: true },
    { size: "US 13", inStock: false },
  ]

  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-3 gap-2">
      {sizes.map((sizeOption) => (
        <button
          key={sizeOption.size}
          className={cn(
            "flex h-12 items-center justify-center rounded-md border text-sm font-medium transition-colors",
            sizeOption.inStock
              ? selectedSize === sizeOption.size
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:bg-muted"
              : "cursor-not-allowed border-dashed border-muted-foreground/50 text-muted-foreground",
          )}
          disabled={!sizeOption.inStock}
          onClick={() => setSelectedSize(sizeOption.size)}
        >
          {sizeOption.size}
        </button>
      ))}
    </div>
  )
}
