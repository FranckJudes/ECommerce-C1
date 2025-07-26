"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCategory,
  updateCategory,
  getCategoryProducts,
} from "../../../../../lib/api";
import { useAuth } from "../../../../../lib/auth-context";
import Link from "next/link";

export default function CategoryDetailPage({ params }) {
  const categoryId = parseInt(params.id);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchCategoryDetails();
  }, [user, router, categoryId]);

  const fetchCategoryDetails = async () => {
    setIsLoading(true);
    try {
      const categoryData = await getCategory(categoryId);
      setCategory(categoryData);
      setFormData({
        name: categoryData.name,
        description: categoryData.description,
      });

      const productsData = await getCategoryProducts(categoryId);
      setProducts(productsData.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de la catégorie",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategory(categoryId, formData);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès",
      });
      fetchCategoryDetails();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-7">Chargement des détails...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container px-4 py-7">
        <div className="text-center">
          <h2 className="text-xl font-bold">Catégorie non trouvée</h2>
          <Button asChild className="mt-4">
            <Link href="/admin/categories">Retour à la liste</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Détails de la catégorie</h1>
        <Button asChild variant="default">
          <Link href="/admin/categories">Retour à la liste</Link>
        </Button>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>
              ID: {category.id} | Créée le: {new Date(category.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nom de la catégorie"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateCategory}>Enregistrer</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Nom</h3>
                  <p>{category.name}</p>
                </div>
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{category.description}</p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsEditing(true)}>Modifier</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits dans cette catégorie</CardTitle>
            <CardDescription>
              {products.length} produit{products.length !== 1 ? "s" : ""} trouvé{products.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-4">
                <p>Aucun produit</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/products">Gérer les produits</Link>
                </Button>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td className="font-medium">{product.name}</td>
                        <td>{product.price} €</td>
                        <td>{product.stock}</td>
                        <td className="text-right">
                          <Button asChild size="sm" variant="default">
                            <Link href={`/admin/products/${product.id}`}>
                              Voir
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// export default function CategoryDetailPage() {
//   return <div>Page temporaire</div>;
// }