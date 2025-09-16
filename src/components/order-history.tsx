"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getOrders } from "../../lib/api";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
    featured?: boolean;
  };
}

interface Order {
  id: number;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersFromApi = await getOrders(); // renvoie déjà un tableau
        setOrders(ordersFromApi || []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof AxiosError && err.response?.data?.message
            ? err.response.data.message
            : "Impossible de charger les commandes";
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
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center py-12">Erreur : {error}</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Vos commandes</h3>

      {orders.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {orders.map((order) => (
            <AccordionItem key={order.id} value={order.id.toString()}>
              <AccordionTrigger className="py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left">
                  <div className="flex flex-col">
                    <span className="font-medium">Commande #{order.id}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm ${
                        order.status === "completed"
                          ? "text-green-500"
                          : order.status === "pending"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-medium">{order.total.toFixed(2)} €</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                        <Image
                          src={
                            item.product.image
                              ? item.product.image.startsWith("/")
                                ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${item.product.image}`
                                : item.product.image
                              : "/placeholder.svg"
                          }
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.price.toFixed(2)} €</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>Voir le détail</Link>
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Aucune commande</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commandes.</p>
          <Button asChild>
            <Link href="/products">Commencer vos achats</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
