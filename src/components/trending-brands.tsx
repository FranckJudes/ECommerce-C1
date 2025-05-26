// components/TrendingBrands.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getBrands, Brand } from "../../lib/api";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

export default function TrendingBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await getBrands();
        console.log("Données des marques:", response); // Pour déboguer
        setBrands(response.data || []);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les marques";
        console.error("Erreur dans TrendingBrands:", error);
        setError(errorMessage);
        setLoading(false);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
    fetchBrands();
  }, []);

  if (loading) return <p>Chargement des marques...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {brands.map((brand) => (
        <Link key={brand.id} href={`/brands/${brand.id}`}>
          <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="relative w-16 h-16 mb-3">
                <Image src={brand.image || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
              </div>
              <h3 className="font-medium text-center">{brand.name}</h3>
              <p className="text-xs text-muted-foreground text-center">{brand.product_count} Produits</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}