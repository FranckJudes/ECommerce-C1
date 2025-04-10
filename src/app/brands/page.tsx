import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function BrandsPage() {
  // Dans une application réelle, ces données seraient récupérées depuis une API
  const brands = [
    {
      id: "1",
      name: "Nike",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 120,
      description:
        "Just Do It. Nike est l'une des marques de sport les plus reconnues au monde, offrant des chaussures innovantes pour tous les sports.",
    },
    {
      id: "2",
      name: "Adidas",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 95,
      description:
        "Impossible is Nothing. Adidas propose des chaussures de sport et de lifestyle combinant performance et style.",
    },
    {
      id: "3",
      name: "New Balance",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 78,
      description:
        "Worn by anyone. New Balance est connue pour ses chaussures de course confortables et durables avec un style rétro distinctif.",
    },
    {
      id: "4",
      name: "Jordan",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 110,
      description:
        "Inspirée par Michael Jordan, la marque Jordan est synonyme de performance et de style sur et en dehors du terrain de basket.",
    },
    {
      id: "5",
      name: "Puma",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 65,
      description:
        "Forever Faster. Puma combine influences sportives et streetwear pour créer des chaussures à la fois fonctionnelles et tendance.",
    },
    {
      id: "6",
      name: "Reebok",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 42,
      description:
        "Be More Human. Reebok propose des chaussures de fitness et lifestyle avec un accent sur le confort et la performance.",
    },
    {
      id: "7",
      name: "Converse",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 38,
      description:
        "Les chaussures Converse sont des icônes intemporelles de la culture populaire, connues pour leur style simple et polyvalent.",
    },
    {
      id: "8",
      name: "Vans",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 45,
      description:
        "Off The Wall. Vans est célèbre pour ses chaussures de skate durables qui sont devenues des classiques du streetwear.",
    },
    {
      id: "9",
      name: "ASICS",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 32,
      description:
        "Sound Mind, Sound Body. ASICS est spécialisée dans les chaussures de course techniques offrant support et confort.",
    },
    {
      id: "10",
      name: "Under Armour",
      image: "/placeholder.svg?height=100&width=100",
      productCount: 28,
      description:
        "Under Armour crée des chaussures de sport innovantes conçues pour améliorer les performances athlétiques.",
    },
  ]

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marques</h1>
          <p className="text-muted-foreground">Découvrez nos marques de sneakers premium</p>
        </div>
        <div className="w-full md:w-auto">
          <Input placeholder="Rechercher une marque" className="max-w-xs" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/brands/${brand.id}`} className="group">
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={brand.image || "/placeholder.svg"}
                      alt={brand.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">{brand.productCount} Produits</p>
                  </div>
                </div>
                <p className="text-sm">{brand.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
