"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { getProducts, getCategories } from "../../../lib/api";
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

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts({
            page,
            per_page: 12,
            search: searchQuery,
            sort_by: sortOption === "newest" ? "created_at" : "price",
            sort_direction: sortOption === "price-low" ? "asc" : sortOption === "price-high" ? "desc" : "desc",
          }),
          getCategories(),
        ]);
        setProducts(productsData.data);
        setCategories(categoriesData);
        setHasMore(!!productsData.next_page_url);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les produits";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [page, searchQuery, sortOption]);

  const filteredProducts = products.filter((product) => {
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category_id)) {
      return false;
    }
    return true;
  });

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSearchQuery("");
    setSortOption("newest");
  };

  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Prix</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            min={0}
            max={1000}
            step={10}
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
        <h3 className="text-lg font-medium mb-4">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
              />
              <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );

  if (loading && page === 1) {
    return (
      <div className="container px-4 py-8">
        <div className="flex justify-between mb-8">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-10 w-1/4" />
        </div>
        <div className="flex gap-8">
          <div className="hidden md:block w-1/4">
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container px-4 py-8">Erreur : {error}</div>;
  }

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
          <Input
            placeholder="Rechercher"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[200px]"
          />
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                brand={categories.find((c) => c.id === product.category_id)?.name || "Inconnue"}
                is_new={product.featured}
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

          {filteredProducts.length > 0 && hasMore && (
            <div className="flex justify-center mt-12">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading ? "Chargement..." : "Charger plus"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}