"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "../../../../lib/auth-context";
import api, { getProduct, getCategoryProducts } from "../../../../lib/api";
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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Tailles simulées (l'API ne fournit pas ce champ)
  const sizes = ["US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 11.5", "US 12"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productData = await getProduct(productId);
        setProduct(productData);

        // Charger les produits similaires (même catégorie)
        const relatedData = await getCategoryProducts(productData.category_id, { per_page: 4 });
        setRelatedProducts(relatedData.data.filter((p) => p.id !== productId));

        // Vérifier si le produit est dans les favoris (si connecté)
        if (user) {
          // À implémenter : vérifier via GET /SavedItems
          // Pour l'instant, supposons qu'il n'est pas favori
          setIsFavorite(false);
        }

        setIsLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger le produit";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [productId, user]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Veuillez sélectionner une taille",
        description: "Vous devez sélectionner une taille avant d'ajouter au panier.",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    setIsLoading(true);
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: 1,
    });

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} (Taille: ${selectedSize}) a été ajouté à votre panier.`,
    });
    setIsLoading(false);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter aux favoris.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    try {
      if (isFavorite) {
        // Supprimer des favoris
        await api.delete(`/SavedItems/${productId}`);
        setIsFavorite(false);
        toast({
          title: "Retiré des favoris",
          description: `${product?.name} a été retiré de vos favoris.`,
        });
      } else {
        // Ajouter aux favoris
        await api.post("/SavedItems", { product_id: productId });
        setIsFavorite(true);
        toast({
          title: "Ajouté aux favoris",
          description: `${product?.name} a été ajouté à vos favoris.`,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Erreur lors de la gestion des favoris";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <Skeleton className="h-6 w-1/2 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="container px-4 py-8">Erreur : {error || "Produit non trouvé"}</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Produits
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {/* Simuler plusieurs images si nécessaire */}
          <div className="grid grid-cols-4 gap-2">
            {[product.image, product.image, product.image, product.image].map((image, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-md bg-muted cursor-pointer">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">{product.price} €</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Taille</h3>
              <RadioGroup value={selectedSize || ""} onValueChange={setSelectedSize} className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={isLoading}>
                {isLoading ? "Ajout en cours..." : "Ajouter au panier"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : ""}`} />
                <span className="sr-only">{isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Partager</span>
              </Button>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <strong>Authentification:</strong> Tous les produits sont vérifiés par nos experts.
              </p>
              <p>
                <strong>Livraison:</strong> Livraison gratuite pour les commandes de plus de 100 €.
              </p>
              <p>
                <strong>Retours:</strong> Retours gratuits sous 30 jours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="text-muted-foreground">
          <p>{product.description}</p>
        </TabsContent>
        <TabsContent value="details">
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Matériau : Non spécifié</li>
            <li>Catégorie ID : {product.category_id}</li>
            <li>Stock : {product.stock}</li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews">
          <p className="text-muted-foreground">Aucun avis disponible pour ce produit.</p>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Produits similaires</h2>
            <Button variant="link" asChild>
              <Link href="/products">Voir tout</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group">
                <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                  <div className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start p-4">
                    <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="font-bold mt-1">{relatedProduct.price} €</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}