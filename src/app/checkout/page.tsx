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
import { toast } from "react-toastify";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "../../../lib/auth-context";
import { createOrder, processPayment } from "../../../lib/api";
import { AxiosError } from "axios";
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
  const { cart = [], clearCart } = useCart() as unknown as { cart: CartItem[]; clearCart: () => void };
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
    
    // Vérifier que tous les champs requis sont remplis
    const missingFields = requiredFields.filter(field => !shippingInfo[field]?.trim());
    const allFieldsFilled = missingFields.length === 0;

    // Validation email basique
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email);

    if (!allFieldsFilled) {
      toast.error(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}.`);
      return false;
    }

    if (!emailValid) {
      toast.error("Veuillez entrer une adresse email valide.");
      return false;
    }

    return true;
  };

  const validatePayment = () => {
    if (paymentInfo.paymentMethod === "card") {
      const cardFields = {
        "Nom sur la carte": paymentInfo.cardName?.trim(),
        "Numéro de carte": paymentInfo.cardNumber?.trim(),
        "Date d'expiration": paymentInfo.expiry?.trim(),
        "CVV": paymentInfo.cvv?.trim()
      };
      
      const missingFields = Object.entries(cardFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      
      const hasAllCardInfo = missingFields.length === 0;

      if (!hasAllCardInfo) {
        toast.error(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}.`);
      }

      return hasAllCardInfo;
    } else if (paymentInfo.paymentMethod === "mtn") {
      const hasPhoneNumber = !!paymentInfo.phoneNumber?.trim();
      if (!hasPhoneNumber) {
        toast.error("Veuillez entrer votre numéro de téléphone pour MTN Mobile Money.");
      }
      return hasPhoneNumber;
    } else if (paymentInfo.paymentMethod === "paypal") {
      return true; // PayPal est simulé
    }
    return false;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) {
      setStep("shipping");
      return;
    }

    if (!validatePayment()) {
      setStep("payment");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Votre panier est vide. Ajoutez des produits avant de passer une commande.");
      router.push("/products");
      return;
    }

    setIsLoading(true);

    setIsLoading(true);
    
    try {
      // Créer l'adresse de livraison
      const shippingAddress = `${shippingInfo.address}${shippingInfo.address2 ? ", " + shippingInfo.address2 : ""}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}, ${shippingInfo.country}`;

      // Préparer les données de la commande
      const orderData = {
        items: cart.map((item) => ({
          product_id: parseInt(item.id) || 1,
          quantity: item.quantity,
        })),
        shipping_address: shippingAddress,
        payment_method: paymentInfo.paymentMethod,
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        guest_id: user ? undefined : guestId,
      };

      // Créer la commande
      const orderResponse = await createOrder(orderData);

      if (!orderResponse || !orderResponse.id) {
        toast.error("Impossible de créer la commande. Veuillez réessayer.");
        setIsLoading(false);
        return;
      }
      
      // Traiter le paiement
      const paymentData = {
        order_id: orderResponse.id,
        payment_method: paymentInfo.paymentMethod,
        amount: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      if (paymentInfo.paymentMethod === "card") {
        const [expiryMonth, expiryYear] = (paymentInfo.expiry || "01/25").split("/");
        paymentData.card_number = paymentInfo.cardNumber;
        paymentData.expiry_month = expiryMonth;
        paymentData.expiry_year = expiryYear.length === 2 ? `20${expiryYear}` : expiryYear;
        paymentData.cvc = paymentInfo.cvv;
      } else if (paymentInfo.paymentMethod === "mtn") {
        paymentData.phone_number = paymentInfo.phoneNumber;
      }

      try {
        const paymentResponse = await processPayment(paymentData);
        
        if (paymentResponse && paymentResponse.success) {
          // Vider le panier
          clearCart();
          
          toast.success(`Votre commande #${orderResponse.id} a été créée et payée avec succès.`);
          
          router.push(`/orders/${orderResponse.id}`);
        } else {
          toast.error(paymentResponse?.message || "Le paiement a échoué. Veuillez réessayer.");
        }
      } catch (paymentError) {
        const errorMessage = paymentError instanceof AxiosError && paymentError.response?.data?.message
          ? paymentError.response.data.message
          : "Le paiement a rencontré un problème, mais la commande a été créée.";
          
        toast.error(errorMessage);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Une erreur s'est produite lors de la création de la commande.";
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep("payment");
      toast("Informations de livraison validées");
    }
  };

  const handleContinueToReview = () => {
    if (validatePayment()) {
      setStep("review");
      toast("Informations de paiement validées");
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
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address2">Appartement, suite, etc. (optionnel)</Label>
                    <Input
                      id="address2"
                      value={shippingInfo.address2 || ""}
                      onChange={handleShippingChange}
                      placeholder="Apt 4B"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">État/Province *</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      placeholder="NY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Code postal *</Label>
                    <Input
                      id="zip"
                      value={shippingInfo.zip}
                      onChange={handleShippingChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays *</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      placeholder="United States"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      placeholder="(123) 456-7890"
                      required
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
                onClick={handleContinueToPayment}
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
                        <Label htmlFor="cardName">Nom sur la carte *</Label>
                        <Input
                          id="cardName"
                          value={paymentInfo.cardName || ""}
                          onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="cardNumber">Numéro de carte *</Label>
                        <Input
                          id="cardNumber"
                          value={paymentInfo.cardNumber || ""}
                          onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Date d&apos;expiration *</Label>
                        <Input
                          id="expiry"
                          value={paymentInfo.expiry || ""}
                          onChange={(e) => handlePaymentChange("expiry", e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={paymentInfo.cvv || ""}
                          onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mtn" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone MTN *</Label>
                      <Input
                        id="phoneNumber"
                        value={paymentInfo.phoneNumber || ""}
                        onChange={(e) => handlePaymentChange("phoneNumber", e.target.value)}
                        placeholder="237612345678"
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-4">
                    <div className="text-center py-8">
                      <p className="mb-4">Vous serez redirigé vers PayPal pour compléter votre paiement.</p>
                      <Button variant="secondary" disabled>
                        Continuer avec PayPal (Simulation)
                      </Button>
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
                  onClick={handleContinueToReview}
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
                        ? `Carte se terminant par ${paymentInfo.cardNumber?.slice(-4) || "****"}`
                        : paymentInfo.paymentMethod === "mtn"
                        ? `MTN Mobile Money (${paymentInfo.phoneNumber})`
                        : "PayPal"}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Articles</h3>
                    <div className="space-y-3">
                      {cart && cart.length > 0 ? (
                        cart.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                              <Image
                                src={item.image && !item.image.startsWith('/') ? item.image : item.image && item.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${item.image}` : "/placeholder.svg"}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Taille: {item.size}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${item.price}</p>
                              <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun article dans le panier</p>
                      )}
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