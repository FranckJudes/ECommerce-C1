"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "../../../lib/auth-context";
import { getOrders, cancelOrder } from "../../../lib/api";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const { user } = useAuth();

  
  useEffect(() => {
    // This effect previously set guestId, which is now removed as unused.
    // If you need to use guestId in the future, you can restore this logic.
  }, []);
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Impossible de charger les commandes");
      }
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

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
    fetchOrders();
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Voulez-vous vraiment annuler cette commande ?")) return;

    try {
      await cancelOrder(orderId.toString());
      setOrders(orders.filter((order) => order.id !== orderId));
      toast({
        title: "Commande annulée",
        description: `La commande #${orderId} a été annulée avec succès.`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'annuler la commande.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
      {!user && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Suivre vos commandes</h2>
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
            <Button type="submit">Voir mes commandes</Button>
          </form>
        </div>
      )}
      {error && <p className="text-red-500 mb-4">Erreur : {error}</p>}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Vous n&apos;avez aucune commande pour le moment.</p>
          <Button asChild>
            <Link href="/products">Découvrir les produits</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Commande #{order.id}</CardTitle>
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
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Articles</h3>
                    <div className="space-y-3 mt-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              className="rounded-md object-cover w-full h-full"
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
                </div>
                <div className="flex gap-4 mt-6">
                  <Button asChild>
                    <Link href={`/orders/${order.id}`}>Voir les détails</Link>
                  </Button>
                  {order.status === "pending" && (
                    <Button variant="destructive" onClick={() => handleCancelOrder(order.id)}>
                      Annuler la commande
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}