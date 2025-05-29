"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";
import { Category } from "../../../../lib/api";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });
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

    fetchCategories();
  }, [user, router]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les catégories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleAddCategory = async () => {
    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      
      // Append image file if it exists
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      // @ts-ignore - FormData is handled in the createCategory function
      await createCategory(formDataObj);
      setIsAddDialogOpen(false);
      setFormData({ name: "", description: "", image: null });
      toast({
        title: "Succès",
        description: "Catégorie ajoutée avec succès",
      });
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      
      // Append image file if it exists
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      // @ts-ignore - FormData is handled in the updateCategory function
      await updateCategory(selectedCategory.id, formDataObj);
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setFormData({ name: "", description: "", image: null });
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès",
      });
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id);
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: null,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des catégories</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin">Retour au tableau de bord</Link>
          </Button>
          <Button onClick={() => {
            setFormData({ name: "", description: "", image: null });
            setIsAddDialogOpen(true);
          }}>
            Ajouter une catégorie
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement des catégories...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucune catégorie trouvée
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.image && (
                          <div className="relative w-10 h-10 overflow-hidden rounded-md">
                            <Image 
                              src={category.image && !category.image.startsWith('/') ? category.image : category.image && category.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${category.image}` : "/placeholder.svg"}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.description.length > 100
                        ? `${category.description.substring(0, 100)}...`
                        : category.description}
                    </TableCell>
                    <TableCell>
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(category)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogue d'ajout de catégorie */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de la catégorie"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description de la catégorie"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">Formats acceptés: JPG, PNG, GIF (max 2MB)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCategory}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de modification de catégorie */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de la catégorie"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description de la catégorie"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image</Label>
              {selectedCategory?.image && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500 mb-1">Image actuelle:</p>
                  <div className="relative w-32 h-32 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={selectedCategory.image && !selectedCategory.image.startsWith('/') ? selectedCategory.image : selectedCategory.image && selectedCategory.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${selectedCategory.image}` : "/placeholder.svg"}
                      alt={selectedCategory.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <Input
                id="edit-image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">Formats acceptés: JPG, PNG, GIF (max 2MB)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditCategory}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir supprimer la catégorie{" "}
              <strong>{selectedCategory?.name}</strong> ?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cette action est irréversible et supprimera définitivement cette catégorie.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
