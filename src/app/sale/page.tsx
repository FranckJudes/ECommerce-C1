"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "../../../lib/api";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image: string;
  featured: boolean;
  coming_soon: boolean;
  created_at: string;
  updated_at: string;
}

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("discount");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts({
          featured: true, // Assuming featured products are on sale
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les produits en solde";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // Assuming a 20% discount for demonstration
    const discountPercent = 20;
    const aDiscountPrice = a.price * (1 - discountPercent / 100);
    const bDiscountPrice = b.price * (1 - discountPercent / 100);
    
    switch (sortOption) {
      case "discount":
        return (b.price - bDiscountPrice) - (a.price - aDiscountPrice);
      case "price-low":
        return aDiscountPrice - bDiscountPrice;
      case "price-high":
        return bDiscountPrice - aDiscountPrice;
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

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
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input 
            placeholder="Rechercher" 
            className="w-full sm:w-[200px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={sortOption} onValueChange={setSortOption}>
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Aucun produit en solde trouvé</h3>
          <p className="text-muted-foreground mb-6">Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
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
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      -20% {/* Assuming a fixed discount for demonstration */}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4">
                  <p className="text-sm text-muted-foreground">Sneakers</p>
                  <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-bold">{(product.price * 0.8).toFixed(2)} €</p>
                    <p className="text-sm text-muted-foreground line-through">{product.price} €</p>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
