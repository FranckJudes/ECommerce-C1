"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPaymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } from "../../lib/api"
import { toast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const paymentFormSchema = z.object({
  cardName: z.string().min(1, "Le nom sur la carte est requis"),
  cardNumber: z.string().min(16, "Le numéro de carte doit contenir au moins 16 chiffres"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Format d'expiration invalide (MM/YY)"),
  cvv: z.string().min(3, "CVV invalide").max(4, "CVV invalide"),
  defaultCard: z.boolean().optional()
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

import type * as api from "../../lib/api";

export default function PaymentMethods() {
  const [showAddCard, setShowAddCard] = useState(false)
  
    const [paymentMethods, setPaymentMethods] = useState<api.PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      defaultCard: false
    }
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const response = await getPaymentMethods();
        setPaymentMethods(response.data || []);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les méthodes de paiement";
        setError(errorMessage);
        setLoading(false);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleAddPaymentMethod = async (data: PaymentFormValues) => {
    try {
      const response = await addPaymentMethod({
        card_name: data.cardName,
        card_number: data.cardNumber,
        expiry: data.expiry,
        cvv: data.cvv,
        is_default: data.defaultCard || false
      });
      
      setPaymentMethods([...paymentMethods, response.data]);
      setShowAddCard(false);
      form.reset();
      
      toast({
        title: "Succès",
        description: "Méthode de paiement ajoutée avec succès",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible d'ajouter la méthode de paiement";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRemovePaymentMethod = async (id: number) => {
    try {
      await removePaymentMethod(id);
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      toast({
        title: "Succès",
        description: "Méthode de paiement supprimée",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible de supprimer la méthode de paiement";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultPaymentMethod = async (id: number) => {
    try {
      await setDefaultPaymentMethod(id);
      setPaymentMethods(
        paymentMethods.map(method => ({
          ...method,
          is_default: method.id === id
        }))
      );
      toast({
        title: "Succès",
        description: "Méthode de paiement définie par défaut",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible de définir la méthode de paiement par défaut";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-12">Erreur : {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Méthodes de paiement</h3>
        <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
          <DialogTrigger asChild>
            <Button>Ajouter une méthode de paiement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une méthode de paiement</DialogTitle>
              <DialogDescription>Ajoutez une nouvelle carte de crédit ou de débit à votre compte.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleAddPaymentMethod)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Nom sur la carte</Label>
                <Input 
                  id="cardName" 
                  placeholder="John Doe" 
                  {...form.register("cardName")} 
                />
                {form.formState.errors.cardName && (
                  <p className="text-sm text-destructive">{form.formState.errors.cardName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  {...form.register("cardNumber")} 
                />
                {form.formState.errors.cardNumber && (
                  <p className="text-sm text-destructive">{form.formState.errors.cardNumber.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Date d&pos;expiration</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY" 
                    {...form.register("expiry")} 
                  />
                  {form.formState.errors.expiry && (
                    <p className="text-sm text-destructive">{form.formState.errors.expiry.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    {...form.register("cvv")} 
                  />
                  {form.formState.errors.cvv && (
                    <p className="text-sm text-destructive">{form.formState.errors.cvv.message}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="defaultCard" 
                  className="rounded border-gray-300" 
                  {...form.register("defaultCard")} 
                />
                <Label htmlFor="defaultCard">Définir comme méthode de paiement par défaut</Label>
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddCard(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter la carte</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {method.card_type === "visa" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <circle cx="6" cy="12" r="1" />
                        <circle cx="12" cy="12" r="1" />
                      </svg>
                    )}
                    <CardTitle className="text-lg">
                      {method.card_type === "visa" ? "Visa" : "Mastercard"} se terminant par {method.last4}
                    </CardTitle>
                  </div>
                  {method.is_default && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Par défaut</span>
                  )}
                </div>
                <CardDescription>Expire le {method.expiry}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <div className="flex gap-2">
                  {!method.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    >
                      Définir par défaut
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleRemovePaymentMethod(method.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-6 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucune méthode de paiement</h2>
          <p className="text-muted-foreground mb-6">Vous n&pos;avez pas encore ajouté de méthode de paiement.</p>
          <Button onClick={() => setShowAddCard(true)}>Ajouter une méthode de paiement</Button>
        </div>
      )}
    </div>
  )
}
