export default function CheckoutSummary() {
    // In a real app, this would be fetched from a cart state or API
    const cartItems = [
      {
        id: "1",
        name: "Nike Air Jordan 1 Retro High OG",
        price: 170,
        size: "US 10",
        color: "Chicago",
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "2",
        name: "Adidas Yeezy Boost 350 V2",
        price: 220,
        size: "US 9.5",
        color: "Zebra",
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ]
  
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 9.99
    const tax = subtotal * 0.08 // 8% tax rate
    const total = subtotal + shipping + tax
  
    return (
      <div className="border rounded-lg p-6 space-y-4 sticky top-24">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
  
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} ({item.size}) x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
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
  