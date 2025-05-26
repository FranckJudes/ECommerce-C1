import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function SavedItems() {
  // In a real app, this would be fetched from an API
  const savedItems = [
    {
      id: "1",
      name: "Nike Air Jordan 1 Retro High OG",
      price: 170,
      image: "/placeholder.svg?height=200&width=200",
      brand: "Nike",
      inStock: true,
    },
    {
      id: "2",
      name: "Adidas Yeezy Boost 350 V2",
      price: 220,
      image: "/placeholder.svg?height=200&width=200",
      brand: "Adidas",
      inStock: true,
    },
    {
      id: "3",
      name: "New Balance 990v5",
      price: 185,
      image: "/placeholder.svg?height=200&width=200",
      brand: "New Balance",
      inStock: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Saved Items</h3>
      </div>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-destructive"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    <span className="sr-only">Remove from saved</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <p className="text-sm text-muted-foreground">{item.brand}</p>
                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                <p className="font-bold mt-1">${item.price}</p>

                <div className="w-full mt-4">
                  <Button className="w-full" disabled={!item.inStock}>
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">No saved items</h2>
          <p className="text-muted-foreground mb-6">You haven&apos;t saved any items yet.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}


