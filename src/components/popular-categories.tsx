import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function PopularCategories() {
  // In a real app, this would be fetched from an API
  const categories = [
    {
      id: "1",
      name: "Running",
      image: "/placeholder.svg?height=200&width=200",
      productCount: 86,
    },
    {
      id: "2",
      name: "Basketball",
      image: "/placeholder.svg?height=200&width=200",
      productCount: 120,
    },
    {
      id: "3",
      name: "Lifestyle",
      image: "/placeholder.svg?height=200&width=200",
      productCount: 150,
    },
    {
      id: "4",
      name: "Skateboarding",
      image: "/placeholder.svg?height=200&width=200",
      productCount: 45,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`} className="group">
          <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.productCount} Products</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
