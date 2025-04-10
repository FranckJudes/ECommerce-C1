import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

export default function NewReleasesPage() {
  // Dans une application réelle, ces données seraient récupérées depuis une API
  const newReleases = [
    {
      id: "1",
      name: "Nike Air Jordan 1 Retro High OG 'Chicago Reimagined'",
      price: 180,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
      releaseDate: "2023-10-15",
      isNew: true,
    },
    {
      id: "2",
      name: "Adidas Yeezy Boost 350 V2 'Slate'",
      price: 230,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
      releaseDate: "2023-10-12",
      isNew: true,
    },
    {
      id: "3",
      name: "New Balance 990v6 'Grey Day'",
      price: 200,
      image: "/placeholder.svg?height=300&width=300",
      brand: "New Balance",
      releaseDate: "2023-10-08",
      isNew: true,
    },
    {
      id: "4",
      name: "Nike Dunk Low 'Halloween'",
      price: 120,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
      releaseDate: "2023-10-05",
      isNew: true,
    },
    {
      id: "5",
      name: "Air Jordan 4 'Thunder'",
      price: 210,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Jordan",
      releaseDate: "2023-09-30",
      isNew: true,
    },
    {
      id: "6",
      name: "Adidas Forum Low 'Bad Bunny'",
      price: 160,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
      releaseDate: "2023-09-28",
      isNew: true,
    },
  ]

  const upcomingReleases = [
    {
      id: "7",
      name: "Nike SB Dunk Low 'Mummy'",
      price: 120,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
      releaseDate: "2023-10-25",
      isUpcoming: true,
    },
    {
      id: "8",
      name: "Air Jordan 11 'Gratitude'",
      price: 225,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Jordan",
      releaseDate: "2023-11-11",
      isUpcoming: true,
    },
    {
      id: "9",
      name: "Adidas Samba OG 'Black White'",
      price: 100,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
      releaseDate: "2023-10-30",
      isUpcoming: true,
    },
    {
      id: "10",
      name: "New Balance 550 'Green Yellow'",
      price: 120,
      image: "/placeholder.svg?height=300&width=300",
      brand: "New Balance",
      releaseDate: "2023-11-05",
      isUpcoming: true,
    },
  ]

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Nouvelles Sorties</h1>
          <p className="text-muted-foreground">Les dernières et prochaines sorties de sneakers</p>
        </div>
      </div>

      <Tabs defaultValue="new" className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="new">Nouvelles Sorties</TabsTrigger>
          <TabsTrigger value="upcoming">À Venir</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newReleases.map((product) => (
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
                      <Badge className="absolute top-2 right-2">Nouveau</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between w-full mt-1">
                      <p className="font-bold">{product.price} €</p>
                      <p className="text-xs text-muted-foreground">
                        Sortie le {new Date(product.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingReleases.map((product) => (
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
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        À Venir
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between w-full mt-1">
                      <p className="font-bold">{product.price} €</p>
                      <p className="text-xs text-muted-foreground">
                        Sortie le {new Date(product.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Restez informé des prochaines sorties</h2>
        <p className="text-muted-foreground mb-4">
          Inscrivez-vous à notre newsletter pour être alerté des nouvelles sorties et des réapprovisionnements.
        </p>
        <Button>S&apos;inscrire aux alertes</Button>
      </div>
    </div>
  )
}
