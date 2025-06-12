"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../../../lib/api";
import { AxiosError } from "axios";

interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  is_featured: boolean;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface FormData {
  name: string;
  description: string;
  logo?: File;
  is_featured: boolean;
  status: "active" | "inactive";
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    logo: undefined,
    is_featured: false,
    status: "active",
  });
  const router = useRouter();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await getBrands();
      setBrands(
        (response.data || []).map((brand: unknown) => {
          const b = brand as Brand;
          return {
            ...b,
            status: b.status === "active" ? "active" : "inactive",
          };
        })
      );
    } catch (error: unknown) {
      let errorMessage = "Impossible de charger les marques";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
        if (error.response?.status === 401) {
          router.push("/login");
          return;
        }
      }
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: unknown }
  ) => {
    const name = "target" in e ? e.target.name : e.name;
    const value =
      "target" in e && e.target.type === "file" && e.target instanceof HTMLInputElement
        ? e.target.files?.[0]
        : "target" in e
        ? e.target.value
        : e.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBrand = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la marque est requis",
        variant: "destructive",
      });
      return;
    }
    try {
      await createBrand(formData);
      setIsAddDialogOpen(false);
      setFormData({ name: "", description: "", logo: undefined, is_featured: false, status: "active" });
      toast({
        title: "Succès",
        description: "Marque ajoutée avec succès",
      });
      fetchBrands();
    } catch (error: unknown) {
      let errorMessage = "Impossible d'ajouter la marque";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
        if (error.response?.status === 401) {
          router.push("/login");
          return;
        }
      }
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditBrand = async () => {
    if (!selectedBrand || !formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la marque est requis",
        variant: "destructive",
      });
      return;
    }
    try {
      await updateBrand(selectedBrand.id, formData);
      setIsEditDialogOpen(false);
      setSelectedBrand(null);
      setFormData({ name: "", description: "", logo: undefined, is_featured: false, status: "active" });
      toast({
        title: "Succès",
        description: "Marque mise à jour avec succès",
      });
      fetchBrands();
    } catch (error: unknown) {
      let errorMessage = "Impossible de mettre à jour la marque";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
        if (error.response?.status === 401) {
          router.push("/login");
          return;
        }
      }
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    try {
      await deleteBrand(selectedBrand.id);
      setIsDeleteDialogOpen(false);
      setSelectedBrand(null);
      toast({
        title: "Succès",
        description: "Marque supprimée avec succès",
      });
      fetchBrands();
    } catch (error: unknown) {
      let errorMessage = "Impossible de supprimer la marque";
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          errorMessage = "Cette marque est associée à des produits et ne peut pas être supprimée.";
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
        if (error.response?.status === 401) {
          router.push("/login");
          return;
        }
      }
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      logo: undefined,
      is_featured: brand.is_featured,
      status: brand.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des marques</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin">Retour au tableau de bord</Link>
          </Button>
          <Button
            onClick={() => {
              setFormData({ name: "", description: "", logo: undefined, is_featured: false, status: "active" });
              setIsAddDialogOpen(true);
            }}
          >
            Ajouter une marque
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Chargement des marques...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Mis en avant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Aucune marque trouvée
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.id}</TableCell>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>
                      {(brand.description ?? "").length > 50
                        ? `${(brand.description ?? "").substring(0, 50)}...`
                        : brand.description || "Aucune description"}
                    </TableCell>
                    <TableCell>{brand.status === "active" ? "Actif" : "Inactif"}</TableCell>
                    <TableCell>{brand.is_featured ? "Oui" : "Non"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(brand)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(brand)}
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

      {/* Dialogue pour ajouter une marque */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une marque</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de la marque"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description de la marque"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  handleInputChange({ name: "is_featured", value: checked })
                }
              />
              <Label htmlFor="is_featured">Mis en avant</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange({ name: "status", value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddBrand}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour modifier une marque */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la marque</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de la marque"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description de la marque"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Logo</Label>
              <Input
                id="edit-logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  handleInputChange({ name: "is_featured", value: checked })
                }
              />
              <Label htmlFor="edit-is_featured">Mis en avant</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange({ name: "status", value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditBrand}>Enregistrer</Button>
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
              Êtes-vous sûr de vouloir supprimer la marque{" "}
              <strong>{selectedBrand?.name}</strong> ?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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