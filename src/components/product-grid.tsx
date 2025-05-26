// components/product-grid.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClientProducts } from "../../lib/api";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface ClientProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  is_new: boolean;
  is_upcoming: boolean;
  salePrice?: number;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<ClientProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getClientProducts({ per_page: 12 });
        setProducts(data.data || []);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les produits";
        setError(errorMessage);
        setLoading(false);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center py-12">Erreur : {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
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
                {product.is_new && <Badge className="absolute top-2 right-2">New</Badge>}
                {product.salePrice && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </Badge>
                )}
                {product.is_upcoming && (
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    À venir
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-bold">${product.salePrice || product.price}</p>
                {product.salePrice && <p className="text-sm text-muted-foreground line-through">${product.price}</p>}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}