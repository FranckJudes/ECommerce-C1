// app/categories/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategoryProducts } from "../../../../lib/api";


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

interface ProductsResponse {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export default function CategoryProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const categoryId = params.id as string;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: ProductsResponse = await getCategoryProducts(categoryId);
        setProducts(data.data);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Impossible de charger les produits";
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Produits de la catégorie</h1>
      {products.length === 0 ? (
        <p>Aucun produit trouvé dans cette catégorie.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </CardContent>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.price} €</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Button asChild className="mt-6">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}