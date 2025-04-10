import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function TrendingBrands() {
  // In a real app, this would be fetched from an API
  const brands = [
    {
      id: "1",
      name: "Nike",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 120,
    },
    {
      id: "2",
      name: "Adidas",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 95,
    },
    {
      id: "3",
      name: "New Balance",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 78,
    },
    {
      id: "4",
      name: "Jordan",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 110,
    },
    {
      id: "5",
      name: "Puma",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 65,
    },
    {
      id: "6",
      name: "Reebok",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 42,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {brands.map((brand) => (
        <Link key={brand.id} href={`/brands/${brand.id}`}>
          <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="relative w-16 h-16 mb-3">
                <Image src={brand.image || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
              </div>
              <h3 className="font-medium text-center">{brand.name}</h3>
              <p className="text-xs text-muted-foreground text-center">{brand.productCount} Products</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
