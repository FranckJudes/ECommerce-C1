"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"

export default function ProductPage() {
  // Utiliser useParams au lieu de props.params
  const params = useParams()
  const productId = params.id as string

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()

  // Dans une application réelle, ces données seraient récupérées depuis une API
  const product = {
    id: productId,
    name: "Nike Air Jordan 1 Retro High OG 'Chicago'",
    price: 170,
    brand: "Nike",
    description:
      "La Air Jordan 1 Retro High OG 'Chicago' 2022 ramène le coloris original qui a fait ses débuts en 1985. Construite fidèlement à la spécification originale, la sneaker présente une tige en cuir avec le coloris Chicago Bulls emblématique.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    sizes: ["US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 11.5", "US 12"],
    colors: ["Chicago", "Bred", "Royal"],
    relatedProducts: [
      {
        id: "2",
        name: "Nike Air Jordan 4 Retro",
        price: 200,
        image: "/placeholder.svg?height=300&width=300",
        brand: "Nike",
      },
      {
        id: "3",
        name: "Nike Dunk Low",
        price: 110,
        image: "/placeholder.svg?height=300&width=300",
        brand: "Nike",
      },
      {
        id: "4",
        name: "Nike Air Force 1 '07",
        price: 100,
        image: "/placeholder.svg?height=300&width=300",
        brand: "Nike",
      },
    ],
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Veuillez sélectionner une taille",
        description: "Vous devez sélectionner une taille avant d'ajouter au panier.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simuler un délai d'ajout au panier
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        quantity: 1,
      })

      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} (Taille: ${selectedSize}) a été ajouté à votre panier.`,
      })

      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Produits
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/brands/${product.brand.toLowerCase()}`} className="hover:text-foreground">
          {product.brand}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
            <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-md bg-muted cursor-pointer">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <p className="text-lg text-muted-foreground">{product.brand}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">{product.price} €</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Taille</h3>
              <RadioGroup value={selectedSize || ""} onValueChange={setSelectedSize} className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={isLoading}>
                {isLoading ? "Ajout en cours..." : "Ajouter au panier"}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Ajouter aux favoris</span>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Partager</span>
              </Button>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <strong>Authentification:</strong> Tous les produits sont vérifiés par nos experts.
              </p>
              <p>
                <strong>Livraison:</strong> Livraison gratuite pour les commandes de plus de 100 €.
              </p>
              <p>
                <strong>Retours:</strong> Retours gratuits sous 30 jours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="text-muted-foreground">
          <p>{product.description}</p>
          <p className="mt-4">
            La Air Jordan 1 est la première chaussure signature de Michael Jordan, conçue par Peter Moore et sortie en
            1985. Elle a révolutionné l&apos;industrie des sneakers et reste l&apos;une des silhouettes les plus
            emblématiques et recherchées à ce jour.
          </p>
        </TabsContent>
        <TabsContent value="details">
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Tige en cuir pleine fleur</li>
            <li>Coloris: Blanc/Rouge/Noir</li>
            <li>Semelle intermédiaire en polyuréthane avec unité Air-Sole au talon</li>
            <li>Semelle extérieure en caoutchouc avec motif à chevrons</li>
            <li>Logo Swoosh sur les côtés</li>
            <li>Logo Wings sur le col</li>
            <li>Perforations sur l&apos;avant-pied pour la respirabilité</li>
            <li>Fabriqué au Vietnam</li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">sur 5</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Basé sur 124 avis</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Voir tous les avis
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Produits similaires</h2>
          <Button variant="link" asChild>
            <Link href="/products">Voir tout</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group">
              <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                <div className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start p-4">
                  <p className="text-sm text-muted-foreground">{relatedProduct.brand}</p>
                  <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="font-bold mt-1">{relatedProduct.price} €</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
