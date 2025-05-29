import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function RelatedProducts({  }: { productId: string }) {//productId
  // In a real app, these would be fetched from an API based on the productId
  const products = [
    {
      id: "101",
      name: "Nike Air Force 1 '07",
      price: 110,
      image: "/placeholder.svg?height=200&width=200",
      brand: "Nike",
    },
    {
      id: "102",
      name: "Nike Dunk Low",
      price: 110,
      image: "/placeholder.svg?height=200&width=200",
      brand: "Nike",
    },
    {
      id: "103",
      name: "Air Jordan 4 Retro",
      price: 210,
      image: "/placeholder.svg?height=200&width=200",
      brand: "Jordan",
    },
    {
      id: "104",
      name: "Nike SB Dunk Low Pro",
      price: 115,
      image: "/placeholder.svg?height=200&width=200",
      brand: "Nike",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image && !product.image.startsWith('/') ? product.image : product.image && product.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${product.image}` : "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
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
