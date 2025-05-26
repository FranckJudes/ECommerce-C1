"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "./api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Vérifier si un utilisateur est connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.get("/user");
          setUser(response.data);
        } catch (error) {
          console.error("Erreur lors de la vérification de l'utilisateur:", error);
          localStorage.removeItem("auth_token");
          delete api.defaults.headers.Authorization;
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      const { user, token } = response.data;
      localStorage.setItem("auth_token", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de connexion";
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await api.post("/register", { name, email, password, password_confirmation });
      const { user, token } = response.data;
      localStorage.setItem("auth_token", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur d'inscription";
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.Authorization;
      setUser(null);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post("/forgot-password", { email });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'envoi du lien";
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    try {
      await api.post("/reset-password", { token, email, password, password_confirmation });
      router.push("/auth/sign-in");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la réinitialisation";
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, forgotPassword, resetPassword, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}