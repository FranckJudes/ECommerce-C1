// app/checkout/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "../../../lib/auth-context";
import { createOrder, processPayment } from "../../../lib/api";
// import { AxiosError } from "axios";
import CheckoutSummary from "@/components/checkout-summary";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface PaymentInfo {
  paymentMethod: string;
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  phoneNumber?: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: "card",
  });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [isLoading, setIsLoading] = useState(false);
  const { cart, clearCart } = useCart() as unknown as { cart: CartItem[]; clearCart: () => void };
  const { user } = useAuth();
  const router = useRouter();

  // Générer ou récupérer un guest_id pour les utilisateurs non connectés
  const [guestId, setGuestId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("guest_id");
      if (!id) {
        id = uuidv4();
        localStorage.setItem("guest_id", id);
      }
      setGuestId(id);
    }
  }, []);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.id]: e.target.value });
  };

  const handlePaymentChange = (key: string, value: string) => {
    setPaymentInfo({ ...paymentInfo, [key]: value });
  };

  const validateShipping = () => {
    const requiredFields: Array<keyof ShippingInfo> = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "state",
      "zip",
      "country",
      "phone",
    ];
    return requiredFields.every((field) => (shippingInfo[field] ?? "").trim() !== "");
  };

  const validatePayment = () => {
    if (paymentInfo.paymentMethod === "card") {
      return (
        paymentInfo.cardName?.trim() &&
        paymentInfo.cardNumber?.trim() &&
        paymentInfo.expiry?.trim() &&
        paymentInfo.cvv?.trim()
      );
    } else if (paymentInfo.paymentMethod === "mtn") {
      return paymentInfo.phoneNumber?.trim();
    }
    return true; // PayPal (simulé)
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs d'adresse requis.",
        variant: "destructive",
      });
      setStep("shipping");
      return;
    }

    if (!validatePayment()) {
      toast({
        title: "Informations de paiement manquantes",
        description: "Veuillez fournir toutes les informations de paiement requises.",
        variant: "destructive",
      });
      setStep("payment");
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des produits avant de passer une commande.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Créer l'adresse de livraison
      const shippingAddress = `${shippingInfo.address}${shippingInfo.address2 ? ", " + shippingInfo.address2 : ""}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}, ${shippingInfo.country}`;

      // Préparer les données de la commande
      const orderData = {
        items: cart.map((item) => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
        })),
        shipping_address: shippingAddress,
        payment_method: paymentInfo.paymentMethod,
        email: shippingInfo.email,
        guest_id: user ? undefined : guestId, // Inclure guest_id si non connecté
      };

      // Créer la commande
      const orderResponse = await createOrder(orderData);

      // Traiter le paiement
      const paymentData: {
        order_id: number;
        payment_method: string;
        phone_number?: string;
        card_number?: string;
        expiry_month?: string;
        expiry_year?: string;
        cvc?: string;
      } = {
        order_id: orderResponse.id,
        payment_method: paymentInfo.paymentMethod,
      };

      if (paymentInfo.paymentMethod === "card") {
        const [expiryMonth, expiryYear] = paymentInfo.expiry!.split("/");
        paymentData.card_number = paymentInfo.cardNumber;
        paymentData.expiry_month = expiryMonth;
        paymentData.expiry_year = `20${expiryYear}`;
        paymentData.cvc = paymentInfo.cvv;
      } else if (paymentInfo.paymentMethod === "mtn") {
        paymentData.phone_number = paymentInfo.phoneNumber;
      }

      await processPayment(paymentData);

      // Vider le panier
      clearCart();

      // Rediriger vers la page de confirmation
      toast({
        title: "Commande passée avec succès",
        description: `Votre commande #${orderResponse.id} a été créée et le paiement a été traité.`,
      });
      router.push(`/orders/${orderResponse.id}`);
    } catch (error: unknown) {
      toast({
        title: "Erreur lors de la commande",
        description: (error as Error)?.message || "Une erreur s'est produite lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Link href="/cart" className="text-sm underline">
          Retour au panier
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="flex items-center mb-8">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === "shipping" || step === "payment" || step === "review"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className="h-px flex-1 mx-2 bg-border" />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === "payment" || step === "review"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className="h-px flex-1 mx-2 bg-border" />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === "review" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
          </div>

          {step === "shipping" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Informations de livraison</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address2">Appartement, suite, etc. (optionnel)</Label>
                    <Input
                      id="address2"
                      value={shippingInfo.address2}
                      onChange={handleShippingChange}
                      placeholder="Apt 4B"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">État</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      placeholder="NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Code postal</Label>
                    <Input
                      id="zip"
                      value={shippingInfo.zip}
                      onChange={handleShippingChange}
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      placeholder="United States"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Méthode de livraison</h2>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={(value) => setShippingMethod(value as "standard" | "express")}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-medium">
                        Livraison standard
                      </Label>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$9.99</p>
                      <p className="text-sm text-muted-foreground">2-5 jours ouvrables</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-medium">
                        Livraison express
                      </Label>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$19.99</p>
                      <p className="text-sm text-muted-foreground">1-2 jours ouvrables</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (validateShipping()) {
                    setStep("payment");
                  } else {
                    toast({
                      title: "Informations manquantes",
                      description: "Veuillez remplir tous les champs d'adresse requis.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Continuer vers le paiement
              </Button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Méthode de paiement</h2>
                <Tabs
                  value={paymentInfo.paymentMethod}
                  onValueChange={(value) => handlePaymentChange("paymentMethod", value)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Carte de crédit</TabsTrigger>
                    <TabsTrigger value="mtn">MTN Mobile Money</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input
                          id="cardName"
                          value={paymentInfo.cardName || ""}
                          onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input
                          id="cardNumber"
                          value={paymentInfo.cardNumber || ""}
                          onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Date d&apos;expiration</Label>
                        <Input
                          id="expiry"
                          value={paymentInfo.expiry || ""}
                          onChange={(e) => handlePaymentChange("expiry", e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentInfo.cvv || ""}
                          onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mtn" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone MTN</Label>
                      <Input
                        id="phoneNumber"
                        value={paymentInfo.phoneNumber || ""}
                        onChange={(e) => handlePaymentChange("phoneNumber", e.target.value)}
                        placeholder="237612345678"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-4">
                    <div className="text-center py-8">
                      <p className="mb-4">Vous serez redirigé vers PayPal pour compléter votre paiement.</p>
                      <Button disabled>Continuer avec PayPal</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Adresse de facturation</h2>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    className="rounded border-gray-300"
                    defaultChecked
                    disabled
                  />
                  <Label htmlFor="sameAsShipping">Identique à l&apos;adresse de livraison</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep("shipping")}>
                  Retour
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (validatePayment()) {
                      setStep("review");
                    } else {
                      toast({
                        title: "Informations de paiement manquantes",
                        description: "Veuillez fournir toutes les informations de paiement requises.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Vérifier la commande
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Vérifiez votre commande</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Adresse de livraison</h3>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setStep("shipping")}>
                        Modifier
                      </Button>
                    </div>
                    <p className="text-sm">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p className="text-sm">
                      {shippingInfo.address}
                      {shippingInfo.address2 ? `, ${shippingInfo.address2}` : ""}
                    </p>
                    <p className="text-sm">
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
                    </p>
                    <p className="text-sm">{shippingInfo.country}</p>
                    <p className="text-sm">{shippingInfo.phone}</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Méthode de paiement</h3>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setStep("payment")}>
                        Modifier
                      </Button>
                    </div>
                    <p className="text-sm">
                      {paymentInfo.paymentMethod === "card"
                        ? `Carte se terminant par ${paymentInfo.cardNumber?.slice(-4)}`
                        : paymentInfo.paymentMethod === "mtn"
                        ? `MTN Mobile Money (${paymentInfo.phoneNumber})`
                        : "PayPal"}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Articles</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Taille: {item.size}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.price} €</p>
                            <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep("payment")}>
                  Retour
                </Button>
                <Button className="flex-1" onClick={handlePlaceOrder} disabled={isLoading}>
                  {isLoading ? "Traitement..." : "Passer la commande"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
}