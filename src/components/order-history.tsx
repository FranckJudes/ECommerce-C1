import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function OrderHistory() {
  // In a real app, this would be fetched from an API
  const orders = [
    {
      id: "ORD-12345",
      date: "2023-05-15",
      status: "Delivered",
      total: 390,
      items: [
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
      ],
    },
    {
      id: "ORD-12346",
      date: "2023-04-22",
      status: "Shipped",
      total: 170,
      items: [
        {
          id: "1",
          name: "Nike Air Jordan 1 Retro High OG",
          price: 170,
          size: "US 10",
          color: "Chicago",
          quantity: 1,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
    {
      id: "ORD-12347",
      date: "2023-03-10",
      status: "Delivered",
      total: 220,
      items: [
        {
          id: "2",
          name: "Adidas Yeezy Boost 350 V2",
          price: 220,
          size: "US 9.5",
          color: "Zebra",
          quantity: 1,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Orders</h3>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.id}</span>
                      <span className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm ${
                          order.status === "Delivered"
                            ? "text-green-500"
                            : order.status === "Shipped"
                              ? "text-blue-500"
                              : "text-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>View Order Details</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm">
                          Leave a Review
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-6 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders yet.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
