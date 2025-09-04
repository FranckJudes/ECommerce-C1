// app/account/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountProfile from "@/components/account-profile";
import OrderHistory from "@/components/order-history";
import SavedItems from "@/components/saved-items";
import PaymentMethods from "@/components/payment-methods";
import AddressBook from "@/components/address-book";
import UserBrands from "@/components/user-brands";
import { useAuth } from "../../../lib/auth-context";



export default function AccountPage() {
  const { user, isLoading ,logout} = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in");
    }
    
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Chargement...</div>;
  }
 

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mon Compte</h1>
          <p className="text-muted-foreground">Gérez vos paramètres et préférences</p>
        </div>
       
        <div className="flex gap-2">
      {user.role === "admin" && (
        <Button variant="outline" onClick={() => router.push("../admin")}>
          Tableau de Bord
        </Button>
      )}
      <Button variant="outline" onClick={logout}>
        Déconnexion
      </Button>
    </div>

      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto mb-8">
          <TabsTrigger value="profile" className="flex-1">
            Profil
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex-1">
            Commandes
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            Articles sauvegardés
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1">
            Méthodes de paiement
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex-1">
            Adresses
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex-1">
            Marques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <AccountProfile />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>

        <TabsContent value="saved">
          <SavedItems />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethods />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressBook />
        </TabsContent>

        <TabsContent value="brands">
          <UserBrands />
        </TabsContent>
      </Tabs>
    </div>
  );
}