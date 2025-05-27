"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../../lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user || user.role !== "admin") {
    return null; 
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button variant="outline" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Button asChild className="mb-4">
            <Link href="/admin/products">Gérer les produits</Link>
          </Button>
          <p>Gérer les produits de la boutique.</p>
        </TabsContent>
        <TabsContent value="categories">
          <Button asChild className="mb-4">
            <Link href="/admin/categories">Gérer les catégories</Link>
          </Button>
          <p>Gérer les catégories de produits.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}