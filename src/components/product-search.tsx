"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface SearchResult {
  id: string
  name: string
  price: number
  image: string
  brand: string
}

export default function ProductSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // Simuler une recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simuler un délai d'API
    setTimeout(() => {
      // Résultats de recherche fictifs
      const mockResults: SearchResult[] = [
        {
          id: "1",
          name: "Nike Air Jordan 1 Retro High OG",
          price: 170,
          image: "/placeholder.svg?height=80&width=80",
          brand: "Nike",
        },
        {
          id: "2",
          name: "Nike Dunk Low",
          price: 110,
          image: "/placeholder.svg?height=80&width=80",
          brand: "Nike",
        },
        {
          id: "3",
          name: "Nike Air Force 1 '07",
          price: 100,
          image: "/placeholder.svg?height=80&width=80",
          brand: "Nike",
        },
      ].filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.brand.toLowerCase().includes(query.toLowerCase()),
      )

      setSearchResults(mockResults)
      setIsSearching(false)
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Rechercher des produits</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher des sneakers..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit">Rechercher</Button>
          </div>

          <div className="space-y-4 mt-4">
            {isSearching ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : searchQuery.length > 0 && searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun résultat trouvé pour {searchQuery}</p>
              </div>
            ) : (
              searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm font-bold mt-1">${product.price}</p>
                  </div>
                </Link>
              ))
            )}

            {searchResults.length > 0 && (
              <div className="text-center pt-2">
                <Button variant="link" asChild onClick={() => setIsOpen(false)}>
                  <Link href={`/products?q=${searchQuery}`}>Voir tous les résultats</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
