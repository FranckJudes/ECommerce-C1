"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { getBrand, updateBrand } from "../../../../../../lib/api";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Schéma de validation pour le formulaire
const brandFormSchema = z.object({
  name: z.string().min(1, "Le nom de la marque est requis"),
  description: z.string().optional(),
  logo: z.any().optional(), // Évite l'erreur File is not defined
  is_featured: z.boolean().optional(),
});

export default function EditBrandPage({ params }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_featured: false,
    },
  });

  useEffect(() => {
    const fetchBrand = async () => {
      setIsLoading(true);
      try {
        const response = await getBrand(parseInt(params.id));
        const brand = response.data;

        form.reset({
          name: brand.name || "",
          description: brand.description || "",
          is_featured: brand.is_featured || false,
        });

        if (brand.logo) {
          setLogoPreview(brand.logo);
        }
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError && error.response?.data?.message
            ? error.response.data.message
            : "Impossible de charger les informations de la marque";
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        router.push("/account?tab=brands");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [params.id, router, form]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const brandData = {
        name: data.name || undefined,
        description: data.description || undefined,
        logo: data.logo instanceof File ? data.logo : undefined,
        is_featured: data.is_featured !== undefined ? data.is_featured : undefined,
      };

      await updateBrand(parseInt(params.id), brandData);
      toast({
        title: "Succès",
        description: "Marque mise à jour avec succès",
      });
      router.push("/account?tab=brands");
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de mettre à jour la marque";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-12">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/account?tab=brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Modifier la marque</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la marque</CardTitle>
          <CardDescription>
            Modifiez les informations ci-dessous pour mettre à jour votre marque.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Nom de la marque *
              </label>
              <input
                id="name"
                type="text"
                placeholder="Entrez le nom de la marque"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <span className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Décrivez votre marque"
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...form.register("description")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="logo" className="block text-sm font-medium">
                Logo
              </label>
              <div className="flex flex-col gap-4">
                {logoPreview && (
                  <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                    <Image
                      src={logoPreview}
                      alt="Aperçu du logo"
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                )}
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-sm text-gray-500">
                  Laissez ce champ vide si vous ne souhaitez pas modifier le logo.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="is_featured"
                type="checkbox"
                checked={form.watch("is_featured")}
                onChange={(e) => form.setValue("is_featured", e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="is_featured" className="text-sm font-medium">
                Demander la mise en avant de cette marque
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/account?tab=brands">Annuler</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour la marque"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}


// export default function EditBrandPage() {
//   return <div>Page temporaire</div>;
// }