import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FeaturedProducts() {
  // In a real app, this would be fetched from an API
  const products = [
    {
      id: "1",
      name: "Nike Air Jordan 1 Retro High OG",
      price: 170,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
      isNew: true,
    },
    {
      id: "2",
      name: "Adidas Yeezy Boost 350 V2",
      price: 220,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
      isNew: false,
    },
    {
      id: "3",
      name: "New Balance 990v5",
      price: 185,
      image: "/placeholder.svg?height=300&width=300",
      brand: "New Balance",
      isNew: true,
    },
    {
      id: "4",
      name: "Nike Dunk Low",
      price: 110,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
      isNew: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {product.isNew && <Badge className="absolute top-2 right-2">New</Badge>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="font-bold mt-1">${product.price}</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
