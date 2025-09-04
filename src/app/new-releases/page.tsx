// app/new-releases/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { getClientProducts, ClientProduct } from "../../../lib/api";

export default function NewReleasesPage() {
  const [newReleases, setNewReleases] = useState<ClientProduct[]>([]);
  const [upcomingReleases, setUpcomingReleases] = useState<ClientProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
  
        const [newProducts, upcomingProducts] = await Promise.all([
          getClientProducts({ is_new: true }),
          getClientProducts({ is_upcoming: true })
        ]);
  
        setNewReleases(newProducts.data || []);
        setUpcomingReleases(upcomingProducts.data || []);
  
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Impossible de charger les produits");
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  if (loading) return <div className="container px-4 py-8">Chargement...</div>;
  if (error) return <div className="container px-4 py-8">Erreur : {error}</div>;

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
          {newReleases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">Aucune nouvelle sortie pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newReleases.map((product) => (
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
                        <Badge variant="secondary" className="absolute top-2 right-2">Nouveau</Badge>

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
                          Sortie le {new Date(product.release_date).toLocaleDateString()}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          {upcomingReleases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">Aucune sortie à venir pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {upcomingReleases.map((product) => (
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
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          À venir
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
                          Sortie le {new Date(product.release_date).toLocaleDateString()}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

     
    </div>
  );
}