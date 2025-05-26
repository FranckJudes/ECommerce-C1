"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { getProducts, getCategories } from "../../lib/api";
import { AxiosError } from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Charger les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error: unknown) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Gérer la recherche avec débouncing
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    // Annuler le précédent debounce
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Définir un nouveau debounce
    debounceTimeout.current = setTimeout(async () => {
      try {
        const productsData = await getProducts({ search: query, per_page: 5 });
        setSearchResults(productsData.data);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Erreur lors de la recherche";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    }, 300);

    // Nettoyer le timeout lors du démontage
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Rechercher</span>
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
            <Button type="submit" onClick={() => handleSearch(searchQuery)}>Rechercher</Button>
          </div>

          <div className="space-y-4 mt-4">
            {isSearching ? (
              <div className="space-y-2">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : searchQuery.length > 0 && searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun résultat trouvé pour &quot;{searchQuery}&quot;</p>
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
                    <p className="text-sm text-muted-foreground">
                      {categories.find((c) => c.id === product.category_id)?.name || "Inconnue"}
                    </p>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm font-bold mt-1">{product.price} €</p>
                  </div>
                </Link>
              ))
            )}

            {searchResults.length > 0 && (
              <div className="text-center pt-2">
                <Button variant="link" asChild onClick={() => setIsOpen(false)}>
                  <Link href={`/products?q=${encodeURIComponent(searchQuery)}`}>Voir tous les résultats</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}