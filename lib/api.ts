// import axios, { AxiosInstance, AxiosResponse } from "axios";

// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
// });

// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error) => {
//     console.error("Erreur API détaillée:", {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//       url: error.config?.url,
//     });
//     return Promise.reject(error);
//   }
// );

// // Authentification
// export const login = async (email: string, password: string) => {
//   const response = await api.post("/login", { email, password });
//   return response.data;
// };

// export const register = async (
//   name: string,
//   email: string,
//   password: string,
//   password_confirmation: string
// ) => {
//   const response = await api.post("/register", { name, email, password, password_confirmation });
//   return response.data;
// };

// export const logout = async () => {
//   const response = await api.post("/logout");
//   return response.data;
// };

// export const getUser = async () => {
//   const response = await api.get("/user");
//   return response.data;
// };

// export const updateUser = async (data: {
//   name?: string;
//   email?: string;
//   password?: string;
//   password_confirmation?: string;
// }) => {
//   const response = await api.put("/user", data);
//   return response.data;
// };

// export const updateProfile = async (data: {
//   name?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   city?: string;
//   country?: string;
//   postal_code?: string;
// }) => {
//   const response = await api.put("/profile", data);
//   return response.data;
// };

// export const forgotPassword = async (email: string) => {
//   const response = await api.post("/forgot-password", { email });
//   return response.data;
// };

// export const resetPassword = async (
//   token: string,
//   email: string,
//   password: string,
//   password_confirmation: string
// ) => {
//   const response = await api.post("/reset-password", { token, email, password, password_confirmation });
//   return response.data;
// };

// // Catégories
// export const getCategories = async () => {
//   const response = await api.get("/categories");
//   return response.data;
// };

// export const getCategoryProducts = async (categoryId: string) => {
//   const response = await api.get(`/categories/${categoryId}/products`);
//   return response.data;
// };

// // Produits et marques
// export const getFeaturedProducts = async () => {
//   try {
//     const response = await api.get("/products/featured");
//     return response.data;
//   } catch (error) {
//     console.error("Échec de /products/featured");
//     throw error;
//   }
// };

// export const getBrands = async () => {
//   try {
//     const response = await api.get("/brand");
//     return response.data;
//   } catch (error) {
//     console.error("Échec de /brand");
//     throw error;
//   }
// };

// // Commandes
// export const getOrders = async () => {
//   const response = await api.get("/orders");
//   return response.data;
// };

// export const getOrderDetails = async (orderId: string, params: { user_id: number; guest_id?: undefined; email?: undefined; } | { guest_id: string; email: string; user_id?: undefined; }) => {
//   const response = await api.get(`/orders/${orderId}`);
//   return response.data;
// };

// export const createOrder = async (data: {
//   items: { product_id: number; quantity: number }[];
//   shipping_address: string;
//   payment_method: string;
// }) => {
//   const response = await api.post("/orders", data);
//   return response.data;
// };

// export const cancelOrder = async (orderId: string) => {
//   const response = await api.delete(`/orders/${orderId}`);
//   return response.data;
// };

// // Paiements
// export const processPayment = async (data: {
//   order_id: number;
//   payment_method: string;
//   phone_number?: string;
//   card_number?: string;
//   expiry_month?: string;
//   expiry_year?: string;
//   cvc?: string;
// }) => {
//   const response = await api.post("/payments/process", data);
//   return response.data;
// };

// export const getPaymentHistory = async () => {
//   const response = await api.get("/payments/history");
//   return response.data;
// };

// export const getUserPaymentHistory = async (userId: number) => {
//   const response = await api.get(`/payments/user/${userId}`);
//   return response.data;
// };

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   brand: string;
//   release_date: string;
//   is_new: boolean;
//   is_upcoming: boolean;
// }

// export const getProducts = async (params: { is_new?: boolean; is_upcoming?: boolean } = {}) => {
//   const response = await api.get<{ data: Product[] }>("/products", { params });
//   return response.data;
// };

// export default api;


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

// Catégories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getCategoryProducts = async (categoryId: string) => {
  const response = await api.get(`/categories/${categoryId}/products`);
  return response.data;
};

// Produits et marques
export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/products/featured");
    return response.data;
  } catch (error) {
    console.error("Échec de /products/featured");
    throw error;
  }
};

export const getBrands = async () => {
  try {
    const response = await api.get("/brand");
    return response.data;
  } catch (error) {
    console.error("Échec de /brand");
    throw error;
  }
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



interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  release_date: string;
  is_new: boolean;
  is_upcoming: boolean;
}

export const getProducts = async (params: { is_new?: boolean; is_upcoming?: boolean } = {}) => {
  const response = await api.get<{ data: Product[] }>("/products", { params });
  return response.data;
};

export default api;