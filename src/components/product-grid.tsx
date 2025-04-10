import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProductGrid() {
  // In a real app, this would be fetched from an API
  const products = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: (i + 1).toString(),
      name:
        i % 3 === 0
          ? "Nike Air Jordan 1 Retro High OG"
          : i % 3 === 1
            ? "Adidas Yeezy Boost 350 V2"
            : "New Balance 990v5",
      price: i % 3 === 0 ? 170 : i % 3 === 1 ? 220 : 185,
      image: "/placeholder.svg?height=300&width=300",
      brand: i % 3 === 0 ? "Nike" : i % 3 === 1 ? "Adidas" : "New Balance",
      isNew: i < 4,
      isSale: i >= 8,
      salePrice: i >= 8 ? (i % 3 === 0 ? 140 : i % 3 === 1 ? 180 : 150) : null,
    }))

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
                {product.isSale && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    Sale
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-bold">${product.isSale ? product.salePrice : product.price}</p>
                {product.isSale && <p className="text-sm text-muted-foreground line-through">${product.price}</p>}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
