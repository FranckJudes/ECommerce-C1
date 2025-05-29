"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "../../hooks/use-toast";
import { getBrands, Brand } from "../../../lib/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data.data || []); // Assumons que l'API retourne { data: Brand[] }
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Impossible de charger les marques");
        }
        setLoading(false);
        toast({
          title: "Erreur",
          description: "Impossible de charger les marques",
          variant: "destructive",
        });
      }
    };
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="container px-4 py-8">Chargement...</div>;
  if (error) return <div className="container px-4 py-8">Erreur : {error}</div>;

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marques</h1>
          <p className="text-muted-foreground">Découvrez nos marques de sneakers premium</p>
        </div>
        <div className="w-full md:w-auto">
          <Input
            placeholder="Rechercher une marque"
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredBrands.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg">Aucune marque trouvée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.id}`} className="group">
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden">
                      <Image
                        src={brand.image || "/placeholder.svg"}
                        alt={brand.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{brand.product_count} Produits</p>
                    </div>
                  </div>
                  <p className="text-sm">{brand.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}