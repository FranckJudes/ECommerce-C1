"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
  name?: string
  price?: number
  image?: string
  size?: string
  color?: string
}

export default function AddToCartButton({
  productId,
  name = "Nike Air Jordan 1 Retro High OG",
  price = 170,
  image = "/placeholder.svg?height=150&width=150",
  size = "US 10",
  color = "Chicago",
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    setIsLoading(true)

    // Simuler un délai d'API
    setTimeout(() => {
      addItem({
        id: productId,
        name,
        price,
        size,
        color,
        quantity: 1,
        image,
      })

      setIsLoading(false)

      toast({
        title: "Produit ajouté au panier",
        description: `${name} a été ajouté à votre panier.`,
      })
    }, 600)
  }

  return (
    <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? "Ajout en cours..." : "Ajouter au Panier"}
    </Button>
  )
}
