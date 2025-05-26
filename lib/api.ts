// lib/api.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error("Erreur API détaillée:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// Interface pour les produits de l'API (utilisée par products/page.tsx et products/[id]/page.tsx)
export interface Product {
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

// Interface pour les catégories
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Interface pour les produits côté client (utilisée par new-releases/page.tsx)
export interface ClientProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  release_date: string;
  is_new: boolean;
  is_upcoming: boolean;
}

// Interface pour les marques (utilisée par brands/page.tsx)
export interface Brand {
  id: string;
  name: string;
  image: string;
  product_count: number;
  description: string;
}

// Fonction pour mapper Product vers ClientProduct
const mapProductToClientProduct = async (product: Product): Promise<ClientProduct> => {
  // Récupérer les catégories pour mapper category_id à un nom
  const categories = await getCategories();
  const category = categories.find((c: Category) => c.id === product.category_id);

  // Déterminer si le produit est "nouveau" (créé dans les 30 derniers jours)
  const createdDate = new Date(product.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const isNew = createdDate >= thirtyDaysAgo;

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image || "/placeholder.svg",
    brand: category ? category.name : "Inconnue",
    release_date: product.created_at,
    is_new: isNew,
    is_upcoming: product.coming_soon,
  };
};

// Authentification
export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  const response = await api.post("/register", { name, email, password, password_confirmation });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const updateUser = async (data: {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}) => {
  const response = await api.put("/user", data);
  return response.data;
};

export const updateProfile = async (data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}) => {
  const response = await api.put("/profile", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  const response = await api.post("/reset-password", { token, email, password, password_confirmation });
  return response.data;
};

// Produits
export const getProducts = async (params: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: string;
} = {}) => {
  interface ProductsResponse {
    data: Product[];
    page?: number;
    per_page?: number;
    total?: number;
    next_page_url?: string;
    [key: string]: unknown;
  }
  const response = await api.get<ProductsResponse>("/products", { params });
  return response.data;
};

export const getClientProducts = async (params: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: string;
  is_new?: boolean;
  is_upcoming?: boolean;
} = {}) => {
  const response = await getProducts(params);
  const products = response.data;

  // Mapper vers ClientProduct
  const clientProducts = await Promise.all(products.map(mapProductToClientProduct));

  // Filtrer côté client si is_new ou is_upcoming sont spécifiés
  let filteredProducts = clientProducts;
  if (params.is_new) {
    filteredProducts = filteredProducts.filter((p) => p.is_new);
  }
  if (params.is_upcoming) {
    filteredProducts = filteredProducts.filter((p) => p.is_upcoming);
  }

  return { ...response, data: filteredProducts };
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get<{ data: Product[] }>("/products/featured");
    const products = response.data.data;
    return Promise.all(products.map(mapProductToClientProduct));
  } catch (error) {
    console.error("Échec de /products/featured");
    throw error;
  }
};

export const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image?: string;
  featured?: boolean;
  coming_soon?: boolean;
}) => {
  const response = await api.post<Product>("/products", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category_id?: number;
    image?: string;
    featured?: boolean;
    coming_soon?: boolean;
  }
) => {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Catégories
export const getCategories = async () => {
  const response = await api.get<Category[]>("/categories");
  return response.data;
};

export const getCategory = async (id: number) => {
  const response = await api.get<Category>(`/categories/${id}`);
  return response.data;
};

export const getCategoryProducts = async (
  id: number,
  params: {
    search?: string;
    sort_by?: string;
    sort_direction?: string;
    per_page?: number;
    page?: number;
  } = {}
) => {
  const response = await api.get<{ data: Product[]; [key: string]: unknown }>(`/categories/${id}/products`, { params });
  return response.data;
};

export const createCategory = async (data: {
  name: string;
  description: string;
}) => {
  const response = await api.post<Category>("/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: {
    name?: string;
    description?: string;
  }
) => {
  const response = await api.put<Category>(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Marques
export const getBrands = async () => {
  interface BrandsResponse {
    data: Brand[];
    [key: string]: unknown;
  }
  const response = await api.get<BrandsResponse>("/brands");
  return response.data;
};

// Commandes
export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrderDetails = async (
  orderId: string,
  params: { user_id?: number; guest_id?: string; email?: string } = {}
) => {
  const response = await api.get(`/orders/${orderId}`, { params });
  return response.data;
};

export const createOrder = async (data: {
  items: { product_id: number; quantity: number }[];
  shipping_address: string;
  payment_method: string;
}) => {
  const response = await api.post("/orders", data);
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};

// Paiements
export const processPayment = async (data: {
  order_id: number;
  payment_method: string;
  phone_number?: string;
  card_number?: string;
  expiry_month?: string;
  expiry_year?: string;
  cvc?: string;
}) => {
  const response = await api.post("/payments/process", data);
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get("/payments/history");
  return response.data;
};

export const getUserPaymentHistory = async (userId: number) => {
  const response = await api.get(`/payments/user/${userId}`);
  return response.data;
};



//nouveau endpoint

// lib/api.ts (ajouts à la fin du fichier)

// Avis
export const getReviews = async (productId: string) => {
  interface ReviewsResponse {
    data: Array<{
      id: string;
      user: {
        name: string;
        avatar: string;
      };
      rating: number;
      date: string;
      title: string;
      content: string;
    }>;
    [key: string]: unknown;
  }
  const response = await api.get<ReviewsResponse>(`/products/${productId}/reviews`);
  return response.data;
};

export const submitReview = async (productId: string, data: {
  rating: number;
  title: string;
  content: string;
}) => {
  const response = await api.post(`/reviews`, { product_id: productId, ...data });
  return response.data;
};

// Produits similaires
export const getRelatedProducts = async (productId: string) => {
  interface RelatedProductsResponse {
    data: Array<{
      id: number;
      name: string;
      price: number;
      image: string;
      brand: string;
    }>;
    [key: string]: unknown;
  }
  const response = await api.get<RelatedProductsResponse>(`/products/${productId}/related`);
  return response.data;
};

// Articles favoris
export const getSavedItems = async () => {
  interface SavedItemsResponse {
    data: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
      brand: string;
      inStock: boolean;
    }>;
    [key: string]: unknown;
  }
  const response = await api.get<SavedItemsResponse>("/saved-items");
  return response.data;
};

export const removeSavedItem = async (id: string) => {
  const response = await api.delete(`/saved-items/${id}`);
  return response.data;
};
export default api;


