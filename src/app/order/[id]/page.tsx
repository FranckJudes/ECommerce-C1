// app/orders/[id]/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "../../../../lib/auth-context";
import { getOrderDetails, cancelOrder } from "../../../../lib/api";

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product: {
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
  };
}

interface Order {
  id: number;
  user_id?: number;
  guest_id?: string;
  total: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [guestId, setGuestId] = useState<string>("");
  const { user } = useAuth();
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();

  // Récupérer ou définir guest_id depuis localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("guest_id") || "";
      setGuestId(id);
    }
  }, []);

  // Fonction pour récupérer les détails de la commande
  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = user ? { user_id: user.id } : { guest_id: guestId, email };
      const data = await getOrderDetails(orderId, params);
      setOrder(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError && err.response?.data?.message
        ? err.response.data.message
        : "Impossible de charger les détails de la commande";
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

  // Charger automatiquement pour les utilisateurs connectés
  useEffect(() => {
    if (user) {
      fetchOrder();
    }
  }, [user, orderId]);

  // Gérer la soumission de l'email pour les invités
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer l'email utilisé pour passer la commande.",
        variant: "destructive",
      });
      return;
    }
    fetchOrder();
  };

  // Gérer l'annulation de la commande
  const handleCancelOrder = async () => {
    if (!confirm("Voulez-vous vraiment annuler cette commande ?")) return;

    try {
      await cancelOrder(orderId);
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      toast({
        title: "Commande annulée",
        description: `La commande #${orderId} a été annulée avec succès.`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof AxiosError && err.response?.data?.message
        ? err.response.data.message
        : "Impossible d'annuler la commande";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="container px-4 py-8">Chargement...</div>;
  if (error) return <div className="container px-4 py-8">Erreur : {error}</div>;

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Commande #{orderId}</h1>
        <Button asChild variant="outline">
          <Link href="/orders">Retour aux commandes</Link>
        </Button>
      </div>

      {!user && !order && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Suivre votre commande</h2>
          <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="email">Email utilisé pour la commande</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            <Button type="submit">Voir les détails</Button>
          </form>
        </div>
      )}

      {order && (
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Détails de la commande</CardTitle>
              <Badge
                variant={
                  order.status === "pending"
                    ? "secondary"
                    : order.status === "completed"
                    ? "default"
                    : "destructive"
                }
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Passée le {new Date(order.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium">Articles</h3>
                <div className="space-y-3 mt-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{item.price} €</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Total</h3>
                <p className="text-lg font-bold">{order.total} €</p>
              </div>
              <div>
                <h3 className="font-medium">Adresse de livraison</h3>
                <p className="text-sm">{order.shipping_address}</p>
              </div>
              <div>
                <h3 className="font-medium">Méthode de paiement</h3>
                <p className="text-sm">{order.payment_method}</p>
              </div>
              {order.status === "pending" && (
                <Button variant="destructive" onClick={handleCancelOrder}>
                  Annuler la commande
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}