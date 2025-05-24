// components/FeaturedProducts.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getFeaturedProducts } from "../../lib/api";
import { AxiosError } from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  release_date: string;
  is_new: boolean;
  is_upcoming: boolean;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        console.log("Données des produits:", data);
        // Vérifier que data est un tableau, sinon utiliser un tableau vide
        const productsData = Array.isArray(data) ? data : [];
        setProducts(productsData);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les produits";
        console.error("Erreur dans FeaturedProducts:", error);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} height={300} width="100%" />
          ))}
      </div>
    );
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  if (products.length === 0) {
    return <p>Aucun produit en vedette disponible.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name || "Produit sans nom"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {product.is_new && (
                  <Badge className="absolute top-2 right-2">Nouveau</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <p className="text-sm text-muted-foreground">
                {product.brand || "Marque inconnue"}
              </p>
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                {product.name || "Produit sans nom"}
              </h3>
              <p className="font-bold mt-1">{product.price ? `${product.price} €` : "Prix indisponible"}</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}