import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SalePage() {
  // Dans une application réelle, ces données seraient récupérées depuis une API
  const saleProducts = [
    {
      id: "1",
      name: "Nike Air Jordan 1 Retro High OG",
      price: 170,
      salePrice: 129,
      discount: 24,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
    },
    {
      id: "2",
      name: "Adidas Yeezy Boost 350 V2",
      price: 220,
      salePrice: 175,
      discount: 20,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
    },
    {
      id: "3",
      name: "New Balance 990v5",
      price: 185,
      salePrice: 139,
      discount: 25,
      image: "/placeholder.svg?height=300&width=300",
      brand: "New Balance",
    },
    {
      id: "4",
      name: "Nike Dunk Low",
      price: 110,
      salePrice: 85,
      discount: 23,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
    },
    {
      id: "5",
      name: "Air Jordan 4 Retro",
      price: 200,
      salePrice: 159,
      discount: 20,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Jordan",
    },
    {
      id: "6",
      name: "Adidas Ultra Boost 22",
      price: 190,
      salePrice: 142,
      discount: 25,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
    },
    {
      id: "7",
      name: "Nike Air Force 1 '07",
      price: 110,
      salePrice: 89,
      discount: 19,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
    },
    {
      id: "8",
      name: "Puma Suede Classic",
      price: 70,
      salePrice: 49,
      discount: 30,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Puma",
    },
  ]

  return (
    <div className="container px-4 py-8">
      <div className="relative mb-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Sale background" fill className="object-cover" />
        </div>
        <div className="relative z-10 px-6 py-12 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SOLDES</h1>
          <p className="text-xl md:text-2xl mb-6">Jusqu&apos;à 30% de réduction sur les sneakers sélectionnées</p>
          <p className="text-lg">Offre limitée dans le temps. Jusqu&apos;à épuisement des stocks.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Produits en Solde</h2>
          <p className="text-muted-foreground">Trouvez les meilleures offres sur vos sneakers préférées</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input placeholder="Rechercher" className="w-full sm:w-[200px]" />
          <Select defaultValue="discount">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount">Réduction (élevée à faible)</SelectItem>
              <SelectItem value="price-low">Prix (faible à élevé)</SelectItem>
              <SelectItem value="price-high">Prix (élevé à faible)</SelectItem>
              <SelectItem value="newest">Plus récent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {saleProducts.map((product) => (
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
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    -{product.discount}%
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-bold">{product.salePrice} €</p>
                  <p className="text-sm text-muted-foreground line-through">{product.price} €</p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
