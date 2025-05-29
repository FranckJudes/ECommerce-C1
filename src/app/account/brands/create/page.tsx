"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createBrand } from "../../../../../lib/api";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const brandFormSchema = z.object({
  name: z.string().min(1, "Le nom de la marque est requis"),
  description: z.string().optional(),
  logo: z.any().optional(), // Remplacé z.instanceof(File) par z.any() pour éviter l'erreur serveur
  is_featured: z.boolean().optional(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

export default function CreateBrandPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_featured: false,
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BrandFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        logo: data.logo instanceof File ? data.logo : undefined,
        is_featured: data.is_featured,
      };

      await createBrand(payload);
      toast({
        title: "Succès",
        description: "Marque créée avec succès",
      });
      router.push("/account?tab=brands");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de créer la marque";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/account?tab=brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Créer une marque</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la marque</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer votre marque.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la marque *</Label>
              <Input
                id="name"
                placeholder="Entrez le nom de la marque"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre marque"
                rows={4}
                {...form.register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
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
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={form.watch("is_featured")}
                onCheckedChange={(checked) => form.setValue("is_featured", !!checked)}
              />
              <Label htmlFor="is_featured">Demander la mise en avant de cette marque</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/account?tab=brands">Annuler</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer la marque"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}