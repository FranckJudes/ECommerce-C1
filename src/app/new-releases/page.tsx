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
import { getProducts } from "../../../lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  release_date: string; // Format ISO, ex: "2023-10-15"
  is_new: boolean;
  is_upcoming: boolean;
}

export default function NewReleasesPage() {
  const [newReleases, setNewReleases] = useState<Product[]>([]);
  const [upcomingReleases, setUpcomingReleases] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Récupérer les nouvelles sorties
        const newProducts = await getProducts({ is_new: true });
        setNewReleases(newProducts.data || []);

        // Récupérer les sorties à venir
        const upcomingProducts = await getProducts({ is_upcoming: true });
        setUpcomingReleases(upcomingProducts.data || []);

        setLoading(false);
      } catch (err: unknown) {
        console.error("Erreur lors du chargement des produits :", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Impossible de charger les produits");
        }
        setLoading(false);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        });
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
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <Badge className="absolute top-2 right-2">Nouveau</Badge>
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
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          À Venir
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

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Restez informé des prochaines sorties</h2>
        <p className="text-muted-foreground mb-4">
          Inscrivez-vous à notre newsletter pour être alerté des nouvelles sorties et des réapprovisionnements.
        </p>
        <Button>S&apos;inscrire aux alertes</Button>
      </div>
    </div>
  );
}