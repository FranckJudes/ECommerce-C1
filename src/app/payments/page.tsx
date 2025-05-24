// app/payments/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getPaymentHistory } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";

interface Payment {
  id: number;
  order_id: number;
  payment_method: string;
  amount: number;
  transaction_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour voir votre historique de paiements.",
        variant: "destructive",
      });
      router.push("/auth/sign-in");
    } else if (user) {
      const fetchPayments = async () => {
        try {
          const data = await getPaymentHistory();
          setPayments(data);
          setLoading(false);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Impossible de charger l'historique des paiements");
          }
          setLoading(false);
        }
      };
      fetchPayments();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Historique des paiements</h1>
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Vous n&apos;avez aucun paiement enregistré.</p>
          <Button asChild>
            <Link href="/products">Découvrir les produits</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((payment) => (
            <Card key={payment.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Paiement #{payment.id}</CardTitle>
                  <Badge
                    variant={payment.status === "completed" ? "default" : "destructive"}
                  >
                    {payment.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Effectué le {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Commande</h3>
                    <p className="text-sm">Commande #{payment.order_id}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Montant</h3>
                    <p className="text-lg font-bold">{payment.amount} €</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Méthode de paiement</h3>
                    <p className="text-sm">{payment.payment_method}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">ID de transaction</h3>
                    <p className="text-sm">{payment.transaction_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}