"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart } from "lucide-react"

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { items, removeItem } = useCart()

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-6 w-6" />
        <span className="sr-only">Panier</span>
      </Button>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {items.length}
            </span>
          )}
          <span className="sr-only">Panier</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Votre Panier ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 rounded-md border bg-muted">
                      <Image
                        src={item.image && !item.image.startsWith('/') ? item.image : item.image && item.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${item.image}` : "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Taille: {item.size} | Couleur: {item.color}
                        </p>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="text-sm font-medium">{item.price.toFixed(2)} €</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Sous-total</p>
                  <p className="text-sm font-medium">{subtotal.toFixed(2)} €</p>
                </div>
                <p className="text-xs text-muted-foreground">Frais de livraison et taxes calculés lors du paiement</p>
                <div className="flex flex-col gap-2">
                  <Button asChild onClick={() => setIsOpen(false)}>
                    <Link href="/checkout">Paiement</Link>
                  </Button>
                  <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/cart">Voir le Panier</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
            <div className="text-muted-foreground">
              <ShoppingCart className="h-16 w-16" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Votre panier est vide</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Commencez vos achats pour ajouter des produits à votre panier.
              </p>
            </div>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/products">Découvrir les produits</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
