"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleApplyPromo = () => {
    if (!promoCode) return

    setIsApplyingPromo(true)

    // Simuler un délai d'application du code promo
    setTimeout(() => {
      setIsApplyingPromo(false)
      // Dans une application réelle, vous appliqueriez la réduction ici
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-muted-foreground mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-16 w-16 mx-auto"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">
            Il semble que vous n&apos;ayez pas encore ajouté d&apos;articles à votre panier.
          </p>
          <Button asChild>
            <Link href="/products">Commencer vos achats</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-lg font-semibold">Articles ({items.length})</h2>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
                  Vider le panier
                </Button>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                        </div>
                        {item.size && <p className="mt-1 text-sm text-muted-foreground">Taille: {item.size}</p>}
                        {item.color && <p className="mt-1 text-sm text-muted-foreground">Couleur: {item.color}</p>}
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <p className="text-muted-foreground">Qté:</p>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-r-none"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <div className="h-7 px-2 flex items-center justify-center border-y">{item.quantity}</div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-l-none"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Sous-total</p>
                  <p className="font-medium">{totalPrice.toFixed(2)} €</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Frais de livraison</p>
                  <p className="font-medium">Calculés à l&apos;étape suivante</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Taxes</p>
                  <p className="font-medium">Calculées à l&apos;étape suivante</p>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <p>Total estimé</p>
                  <p>{totalPrice.toFixed(2)} €</p>
                </div>

                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href="/checkout">Passer à la caisse</Link>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-6">
              <h3 className="font-medium mb-2">Code promo</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Entrez votre code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo || !promoCode}>
                  {isApplyingPromo ? "..." : "Appliquer"}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-muted-foreground"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                <div>
                  <h3 className="font-medium">Paiement sécurisé</h3>
                  <p className="text-xs text-muted-foreground">Vos informations de paiement sont sécurisées</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-muted-foreground"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m8 17 4 4 4-4" />
                </svg>
                <div>
                  <h3 className="font-medium">Livraison rapide</h3>
                  <p className="text-xs text-muted-foreground">Livraison en 2-5 jours ouvrables</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-muted-foreground"
                >
                  <path d="m7.5 12 4.5 4.5 4.5-4.5" />
                  <path d="M7.5 7.5 12 12l4.5-4.5" />
                </svg>
                <div>
                  <h3 className="font-medium">Retours faciles</h3>
                  <p className="text-xs text-muted-foreground">Retours gratuits sous 30 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
