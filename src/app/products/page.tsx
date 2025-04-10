"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/product-card"
import { Filter, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 300])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("newest")

  // Dans une application réelle, ces données seraient récupérées depuis une API
  const products = [
    {
      id: "1",
      name: "Nike Air Jordan 1 Retro High OG",
      price: 170,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
      isNew: true,
    },
    {
      id: "2",
      name: "Adidas Yeezy Boost 350 V2",
      price: 220,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
    },
    {
      id: "3",
      name: "New Balance 990v5",
      price: 185,
      image: "/placeholder.svg?height=300&width=300",
      brand: "New Balance",
    },
    {
      id: "4",
      name: "Nike Dunk Low",
      price: 110,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
      isSale: true,
      salePrice: 85,
    },
    {
      id: "5",
      name: "Air Jordan 4 Retro",
      price: 200,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Jordan",
    },
    {
      id: "6",
      name: "Adidas Ultra Boost 22",
      price: 190,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Adidas",
      isSale: true,
      salePrice: 142,
    },
    {
      id: "7",
      name: "Nike Air Force 1 '07",
      price: 110,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Nike",
    },
    {
      id: "8",
      name: "Puma Suede Classic",
      price: 70,
      image: "/placeholder.svg?height=300&width=300",
      brand: "Puma",
      isSale: true,
      salePrice: 49,
    },
  ]

  const brands = ["Nike", "Adidas", "New Balance", "Jordan", "Puma", "Reebok", "Converse", "Vans"]
  const sizes = ["US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 11.5", "US 12"]

  // Filtrer les produits en fonction des critères sélectionnés
  const filteredProducts = products.filter((product) => {
    // Filtre de prix
    const productPrice = product.isSale && product.salePrice ? product.salePrice : product.price
    if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
      return false
    }

    // Filtre de marque
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false
    }

    return true
  })

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.isSale && a.salePrice ? a.salePrice : a.price
    const priceB = b.isSale && b.salePrice ? b.salePrice : b.price

    switch (sortOption) {
      case "price-low":
        return priceA - priceB
      case "price-high":
        return priceB - priceA
      case "newest":
      default:
        return 0 // Dans une application réelle, on utiliserait la date d'ajout
    }
  })

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size])
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    }
  }

  const resetFilters = () => {
    setPriceRange([0, 300])
    setSelectedBrands([])
    setSelectedSizes([])
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Prix</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={priceRange}
            min={0}
            max={300}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm">{priceRange[0]} €</p>
            <p className="text-sm">{priceRange[1]} €</p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Marques</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked === true)}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Tailles</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => handleSizeChange(size, checked === true)}
              />
              <Label htmlFor={`size-${size}`}>{size}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  )

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tous les produits</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input placeholder="Rechercher" className="w-full sm:w-[200px]" />
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récent</SelectItem>
              <SelectItem value="price-low">Prix (faible à élevé)</SelectItem>
              <SelectItem value="price-high">Prix (élevé à faible)</SelectItem>
            </SelectContent>
          </Select>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-1/4 max-w-xs">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="h-5 w-5" />
              <h2 className="text-xl font-bold">Filtres</h2>
            </div>
            <FilterContent />
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                brand={product.brand}
                isNew={product.isNew}
                isSale={product.isSale}
                salePrice={product.salePrice}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Essayez d&apos;ajuster vos filtres ou de rechercher un autre terme.
              </p>
              <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button variant="outline">Charger plus</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
