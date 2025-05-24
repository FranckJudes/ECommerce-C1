// components/TrendingBrands.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getBrands } from "../../lib/api";

interface Brand {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export default function TrendingBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        console.log("Données des marques:", data); // Pour déboguer
        setBrands(data);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Impossible de charger les marques";
        console.error("Erreur dans TrendingBrands:", error);
        setError(errorMessage);
        setLoading(false);
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
              <p className="text-xs text-muted-foreground text-center">{brand.productCount} Produits</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}