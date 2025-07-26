"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllOrders, updateOrderStatus } from "../../../../lib/api";
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
    name: string;
    quantity: number;
    price: number;
  }>;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Define the API order type to match the backend response
  type ApiOrder = {
    id: number;
    user_id: number;
    total: number;
    status: string;
    shipping_address: string;
    payment_method: string;
    items?: Array<{
      product_id: number;
      name: string;
      quantity: number;
      price: number;
    }>;
    created_at: string;
    updated_at: string;
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrders({ page: 1, per_page: 50 });
      // Map API orders to local Order type
      setOrders(
        ((response.data || []) as ApiOrder[]).map((order) => ({
          id: order.id,
          user_id: order.user_id,
          total: order.total,
          status: order.status as Order["status"],
          shipping_address: order.shipping_address,
          payment_method: order.payment_method,
          items: order.items ?? [],
          created_at: order.created_at,
          updated_at: order.updated_at,
        }))
      );
    } catch (error: unknown) {
      let errorMessage = "Impossible de charger les commandes";
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

  const handleStatusChange = async (orderId: number, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast({
        title: "Succès",
        description: "Statut de la commande mis à jour",
      });
    } catch (error: unknown) {
      let errorMessage = "Impossible de mettre à jour le statut";
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


  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des commandes</h1>
        <Button asChild variant="outline">
          <Link href="/admin">Retour au tableau de bord</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Chargement des commandes...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-4">Aucune commande trouvée</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>Utilisateur #{order.user_id}</TableCell>
                        <TableCell>{order.total.toFixed(2)} €</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value as Order["status"])
                            }
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="paid">Payée</SelectItem>
                              <SelectItem value="processing">En traitement</SelectItem>
                              <SelectItem value="shipped">Expédiée</SelectItem>
                              <SelectItem value="delivered">Livrée</SelectItem>
                              <SelectItem value="canceled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              Voir détails
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}