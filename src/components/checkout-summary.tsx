"use client"

import { useCart } from "@/hooks/use-cart"

interface CheckoutSummaryProps {
  shippingMethod: "standard" | "express"
}

export default function CheckoutSummary({ shippingMethod }: CheckoutSummaryProps) {
  const { items } = useCart()

  // Shipping dynamique selon la méthode
  const shipping = shippingMethod === "express" ? 19.99 : 9.99

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <div className="border rounded-lg p-6 space-y-4 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} {item.size ? `(${item.size})` : ""} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Aucun article dans le panier</p>
        )}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
