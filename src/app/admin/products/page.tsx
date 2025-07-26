"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  getProducts,
  createProduct,
  deleteProduct,
  getCategories,
  getBrands,
} from "../../../../lib/api";
import { AxiosError } from "axios";
import { z } from "zod";
//import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  brand_id?: number;
  image: string;
  featured: boolean;
  coming_soon: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string;
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.coerce.number().min(0, "Le prix doit être positif"),
  stock: z.coerce.number().int().min(0, "Le stock doit être un entier positif"),
  category_id: z.coerce.number().int().min(1, "La catégorie est requise"),
  brand_id: z.coerce.number().int().optional(),
  image: z
    .instanceof(File)
    .optional(),
  featured: z.boolean().optional(),
  coming_soon: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category_id: 0,
      brand_id: undefined,
      image: undefined,
      featured: false,
      coming_soon: false,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
        ]);
        setProducts(productsData.data);
        setCategories(categoriesData);
        setBrands(brandsData.data);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les données";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('category_id', data.category_id.toString());
      
      if (data.brand_id) {
        formData.append('brand_id', data.brand_id.toString());
      }
      
      if (data.featured !== undefined) {
        formData.append('featured', data.featured ? '1' : '0');
      }
      
      if (data.coming_soon !== undefined) {
        formData.append('coming_soon', data.coming_soon ? '1' : '0');
      }
      
      // Append image file if it exists
      if (data.image && data.image instanceof FileList && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }
      
      // @ts-ignore - FormData is handled in the createProduct function
      const newProduct = await createProduct(formData);
      setProducts([...products, newProduct]);
      toast({
        title: "Succès",
        description: "Produit créé avec succès.",
      });
      form.reset();
      setIsAddDialogOpen(false);
    } catch (error: unknown) {
      console.error("Erreur de création du produit:", error);
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Échec de la création du produit";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Succès",
        description: "Produit supprimé avec succès.",
      });
    } catch (error: unknown) {
      let errorMessage = "Échec de la suppression du produit";
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          errorMessage = "Vous n'êtes pas autorisé à supprimer ce produit.";
        } else if (error.response?.status === 404) {
          errorMessage = "Produit non trouvé.";
        } else if (error.response?.status === 409) {
          errorMessage = "Ce produit est lié à des commandes et ne peut pas être supprimé.";
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      }
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <Skeleton className="h-10 w-32 mb-4" />
        <Table>
          <TableHeader>
            <TableRow>
              {["Nom", "Prix", "Stock", "Catégorie", "Marque", "Actions"].map((header) => (
                <TableHead key={header}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                {Array(6).fill(0).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return <div className="container px-4 py-8">Erreur : {error}</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des produits</h1>
        <Button asChild variant="outline">
          <Link href="/admin">Retour au tableau de bord</Link>
        </Button>
      </div>
      <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>Ajouter un produit</Button>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreateProduct)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Nom du produit"
                {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description du produit"
                {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("price")} />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                {...form.register("stock")} />
              {form.formState.errors.stock && (
                <p className="text-sm text-red-500">{form.formState.errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Catégorie</Label>
              <Select
                onValueChange={(value) => form.setValue("category_id", parseInt(value), { shouldValidate: true })}
                value={form.getValues("category_id") ? form.getValues("category_id").toString() : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category_id && (
                <p className="text-sm text-red-500">{form.formState.errors.category_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_id">Marque</Label>
              <Select
                onValueChange={(value) => form.setValue("brand_id", value ? parseInt(value) : undefined, { shouldValidate: true })}
                value={form.getValues("brand_id") ? form.getValues("brand_id")?.toString() : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une marque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune marque</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.brand_id && (
                <p className="text-sm text-red-500">{form.formState.errors.brand_id.message}</p>
              )}
            </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                form.setValue("image", file, { shouldValidate: true });
              }}
            />
            {form.formState.errors.image && (
              <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={form.watch("featured")}
              onCheckedChange={(checked) => form.setValue("featured", checked as boolean)}
            />
            <Label htmlFor="featured">Mis en avant</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="coming_soon"
              checked={form.watch("coming_soon")}
              onCheckedChange={(checked) => form.setValue("coming_soon", checked as boolean)}
            />
            <Label htmlFor="coming_soon">Bientôt disponible</Label>
          </div>

          <Button type="submit">Créer</Button>
        </form>
      </DialogContent>
    </Dialog>
    <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Marque</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price} €</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                {categories.find(c => c.id === product.category_id)?.name || "Non catégorisé"}
              </TableCell>
              <TableCell>
                {brands.find(b => b.id === product.brand_id)?.name || "Non spécifiée"}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}