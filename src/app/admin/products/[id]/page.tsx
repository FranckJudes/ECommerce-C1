// app/admin/products/[id]/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  getProduct,
  updateProduct,
  getCategories,
  getBrands,
  deleteProduct,
} from "../../../../../lib/api";
import { AxiosError } from "axios";

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

interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  brand_id?: number;
  image: string;
  featured: boolean;
  coming_soon: boolean;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  category_id?: string;
  brand_id?: string;
  image?: string;
}

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: 0,
    brand_id: undefined,
    image: "",
    featured: false,
    coming_soon: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productData, categoriesData, brandsData] = await Promise.all([
          getProduct(id),
          getCategories(),
          getBrands(),
        ]);
        
        setProduct(productData);
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category_id: productData.category_id,
          brand_id: productData.brand_id,
          image: productData.image || "",
          featured: productData.featured,
          coming_soon: productData.coming_soon,
        });
        setCategories(categoriesData);
        setBrands(brandsData.data);
      } catch (error: unknown) {
        console.error("Erreur lors du chargement du produit:", error);
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger le produit";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Fonction de validation
  const validateForm = (data: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!data.name.trim()) {
      errors.name = "Le nom est requis";
    }
    
    if (!data.description.trim()) {
      errors.description = "La description est requise";
    }
    
    if (data.price < 0) {
      errors.price = "Le prix doit être positif";
    }
    
    if (data.stock < 0) {
      errors.stock = "Le stock doit être positif";
    }
    
    if (data.category_id < 1) {
      errors.category_id = "La catégorie est requise";
    }
    
    return errors;
  };

  // Gestion des changements de formulaire
  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur de validation pour ce champ
    if (field in validationErrors) {
      setValidationErrors(prev => ({
        ...prev,
        [field as keyof ValidationErrors]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setSaving(true);
    try {
      console.log("Données du formulaire:", formData);
      const updatedProduct = await updateProduct(id, formData);
      setProduct(updatedProduct);
      toast({
        title: "Succès",
        description: "Produit mis à jour avec succès.",
      });
    } catch (error: unknown) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Échec de la mise à jour du produit";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      return;
    }
    
    try {
      await deleteProduct(id);
      toast({
        title: "Succès",
        description: "Produit supprimé avec succès.",
      });
      router.push("/admin/products");
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression du produit:", error);
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Échec de la suppression du produit";
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
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid gap-6">
          <div className="h-96 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-bold mb-4">Erreur : {error}</h2>
          <Link 
            href="/admin/products"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à la liste des produits
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-bold mb-4">Produit non trouvé</h2>
          <Link 
            href="/admin/products"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à la liste des produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <style jsx>{`
        .custom-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          background-color: white;
        }
        .custom-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .custom-textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          background-color: white;
          resize: vertical;
        }
        .custom-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .custom-select {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          background-color: white;
        }
        .custom-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .error-text {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        .tab-button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background-color: white;
          border-radius: 0.375rem 0.375rem 0 0;
          cursor: pointer;
        }
        .tab-button.active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        .card-header {
          padding: 1.5rem 1.5rem 0 1.5rem;
        }
        .card-content {
          padding: 1.5rem;
        }
        .card-footer {
          padding: 0 1.5rem 1.5rem 1.5rem;
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modifier le produit</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteProduct}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Supprimer
          </button>
          <Link 
            href="/admin/products"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à la liste
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`tab-button ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Détails du produit
          </button>
          <button
            className={`tab-button ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Aperçu
          </button>
        </div>
      </div>

      {activeTab === "details" && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Informations du produit</h2>
            <p className="text-gray-600">
              ID: {product.id} | Créé le: {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Nom du produit"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {validationErrors.name && (
                    <div className="error-text">{validationErrors.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="custom-input"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  />
                  {validationErrors.price && (
                    <div className="error-text">{validationErrors.price}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="custom-input"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                  />
                  {validationErrors.stock && (
                    <div className="error-text">{validationErrors.stock}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l&apos;image
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="https://exemple.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                  />
                  {validationErrors.image && (
                    <div className="error-text">{validationErrors.image}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    className="custom-select"
                    value={formData.category_id}
                    onChange={(e) => handleInputChange("category_id", parseInt(e.target.value))}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.category_id && (
                    <div className="error-text">{validationErrors.category_id}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque
                  </label>
                  <select
                    className="custom-select"
                    value={formData.brand_id || ""}
                    onChange={(e) => handleInputChange("brand_id", e.target.value ? parseInt(e.target.value) : undefined)}
                  >
                    <option value="">Sélectionner une marque</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.brand_id && (
                    <div className="error-text">{validationErrors.brand_id}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="custom-textarea"
                  placeholder="Description du produit"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
                {validationErrors.description && (
                  <div className="error-text">{validationErrors.description}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    className="mr-2"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange("featured", e.target.checked)}
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mis en avant
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="coming_soon"
                    className="mr-2"
                    checked={formData.coming_soon}
                    onChange={(e) => handleInputChange("coming_soon", e.target.checked)}
                  />
                  <label htmlFor="coming_soon" className="text-sm font-medium text-gray-700">
                    Bientôt disponible
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`${
                    saving 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-blue-500 hover:bg-blue-700"
                  } text-white font-bold py-2 px-4 rounded`}
                >
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-bold">Aperçu du produit</h2>
            <p className="text-gray-600">
              Voici comment le produit apparaîtra sur le site
            </p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Aucune image
                  </div>
                )}
                {product.coming_soon && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded">
                    Bientôt disponible
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-medium rounded">
                    Mis en avant
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-xl font-semibold mt-2">{product.price} €</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>{product.stock > 0 ? `En stock (${product.stock})` : 'Épuisé'}</span>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium">Catégorie:</h3>
                  <p>{categories.find(c => c.id === product.category_id)?.name || "Non catégorisé"}</p>
                </div>
                {product.brand_id && (
                  <div className="mt-2">
                    <h3 className="font-medium">Marque:</h3>
                    <p>{brands.find(b => b.id === product.brand_id)?.name || "Non spécifiée"}</p>
                  </div>
                )}
                <div className="mt-4">
                  <h3 className="font-medium">Description:</h3>
                  <p className="mt-2 text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer flex justify-between">
            <button
              onClick={() => setActiveTab("details")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Retour à l&apos;édition
            </button>
            <Link
              href={`/products/${product.id}`}
              target="_blank"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Voir sur le site
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}