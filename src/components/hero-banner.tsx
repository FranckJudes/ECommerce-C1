"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getClientProducts, ClientProduct } from "../../lib/api";
import { toast } from "@/hooks/use-toast"

export default function HeroBanner() {
  const [slides, setSlides] = useState<ClientProduct[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch des new releases
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await getClientProducts({ is_new: true })
        setSlides(response.data || [])
      } catch (err: unknown) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Impossible de charger les produits")
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Carrousel auto défilement toutes les 2s
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [slides])

  if (loading) {
    return <div className="h-[500px] md:h-[600px] flex items-center justify-center">Chargement...</div>
  }

  if (error || slides.length === 0) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center bg-muted">
        <p className="text-lg">Aucune nouvelle sortie disponible.</p>
      </section>
    )
  }

  const product = slides[current]

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />

      {/* Image du produit */}
      <Image
        src={
          product.image && !product.image.startsWith("/")
            ? product.image
            : product.image && product.image.startsWith("/")
            ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${product.image}`
            : "/placeholder.svg"
        }
        alt={product.name}
        fill
        className="object-cover transition-opacity duration-700"
        priority
      />

      {/* Texte et CTA */}
      <div className="relative z-20 container h-full flex flex-col justify-center px-4">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {product.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {product.brand} – {product.price} €
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href={`/products/${product.id}`}>Shop Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              asChild
            >
              <Link href="/new-releases">Voir toutes les sorties</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
