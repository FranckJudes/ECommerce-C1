"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getBrands, deleteBrand } from "../../lib/api";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function UserBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await getBrands();
        // Filtrer uniquement les marques appartenant à l'utilisateur connecté
        const userBrands = response.data.filter((brand: any) => brand.user_owned);
        setBrands(userBrands || []);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger vos marques";
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

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    
    try {
      await deleteBrand(brandToDelete);
      setBrands(brands.filter(brand => brand.id !== brandToDelete));
      setShowDeleteConfirm(false);
      setBrandToDelete(null);
      toast({
        title: "Succès",
        description: "Marque supprimée avec succès",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible de supprimer la marque";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-12">Erreur : {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Mes Marques</h3>
        <Button asChild>
          <Link href="/account/brands/create">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une marque
          </Link>
        </Button>
      </div>

      {brands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{brand.name}</CardTitle>
                  {brand.is_featured && (
                    <Badge variant="secondary" className="ml-2">Mise en avant</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative aspect-square w-full overflow-hidden bg-muted rounded-md mb-4">
                  <Image 
                    src={brand.logo || "/placeholder.svg"} 
                    alt={brand.name} 
                    fill 
                    className="object-contain" 
                  />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{brand.description || "Aucune description"}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/account/brands/edit/${brand.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setBrandToDelete(brand.id);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-6 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucune marque</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore créé de marques.</p>
          <Button asChild>
            <Link href="/account/brands/create">Créer une marque</Link>
          </Button>
        </div>
      )}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette marque ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteBrand}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
