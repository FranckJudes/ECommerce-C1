"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    size?: string
    color?: string
    quantity: number
    image: string
  }
}

export default function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4">
      <div className="w-full sm:w-32 h-32 bg-muted rounded-md overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={150}
          height={150}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {item.size && `Size: ${item.size}`}
              {item.size && item.color && " | "}
              {item.color && `Color: ${item.color}`}
            </p>
          </div>
          <p className="font-medium">${item.price.toFixed(2)}</p>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none" onClick={incrementQuantity}>
              +
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
              Save for Later
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
