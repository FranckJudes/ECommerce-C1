"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getOrderDetails } from "../../../../../lib/api";
import { AxiosError } from "axios";

interface Order {
  id: number;
  user_id: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "canceled";
  shipping_address: string;
  payment_method: string;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
  created_at: string;
  updated_at: string;
}

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderDetails(orderId);
        setOrder(response);
      } catch (error: unknown) {
        let errorMessage = "Impossible de charger les détails de la commande";
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || errorMessage;
          if (error.response?.status === 401) {
            router.push("/login");
            return;
          }
          if (error.response?.status === 404) {
            errorMessage = "Commande non trouvée";
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
    fetchOrder();
  }, [orderId, router]);

  if (isLoading) {
    return <div className="container px-4 py-8 text-center">Chargement...</div>;
  }

  if (!order) {
    return <div className="container px-4 py-8 text-center">Commande non trouvée</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Commande #{order.id}</h1>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Retour aux commandes</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Total :</strong> {order.total.toFixed(2)} €
            </div>
            <div>
              <strong>Statut :</strong> {order.status}
            </div>
            <div>
              <strong>Adresse de livraison :</strong> {order.shipping_address}
            </div>
            <div>
              <strong>Méthode de paiement :</strong> {order.payment_method}
            </div>
            <div>
              <strong>Date de création :</strong>{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-4">Articles commandés</h3>
              <ul className="list-disc pl-5 mt-2">
                {order.items.map((item) => (
                  <li key={item.product_id}>
                    {item.product.name} - {item.quantity}x à {item.price.toFixed(2)} €
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}