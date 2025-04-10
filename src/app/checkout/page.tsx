"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CheckoutSummary from "@/components/checkout-summary"

export default function CheckoutPage() {
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Link href="/cart" className="text-sm underline">
          Back to cart
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="flex items-center mb-8">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "shipping" || step === "payment" || step === "review" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <div className="h-px flex-1 mx-2 bg-border" />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "payment" || step === "review" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <div className="h-px flex-1 mx-2 bg-border" />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step === "review" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
          </div>

          {step === "shipping" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                    <Input id="address2" placeholder="Apt 4B" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United States" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="(123) 456-7890" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
                <RadioGroup defaultValue="standard" className="space-y-3">
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-medium">
                        Standard Shipping
                      </Label>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$9.99</p>
                      <p className="text-sm text-muted-foreground">2-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-medium">
                        Express Shipping
                      </Label>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$19.99</p>
                      <p className="text-sm text-muted-foreground">1-2 business days</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button className="w-full" size="lg" onClick={() => setStep("payment")}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiration Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-4">
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 mb-4">
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
                      <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                      <Button>Continue with PayPal</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="apple" className="mt-4">
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 mb-4">
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
                          <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                          <path d="M10 2c1 .5 2 2 2 5" />
                        </svg>
                      </div>
                      <p className="mb-4">You will be redirected to Apple Pay to complete your payment.</p>
                      <Button>Continue with Apple Pay</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Billing Address</h2>
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" id="sameAsShipping" className="rounded border-gray-300" defaultChecked />
                  <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep("shipping")}>
                  Back
                </Button>
                <Button className="flex-1" onClick={() => setStep("review")}>
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Review Your Order</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Shipping Address</h3>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setStep("shipping")}>
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm">John Doe</p>
                    <p className="text-sm">123 Main St, Apt 4B</p>
                    <p className="text-sm">New York, NY 10001</p>
                    <p className="text-sm">United States</p>
                    <p className="text-sm">(123) 456-7890</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Payment Method</h3>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setStep("payment")}>
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm">Visa ending in 3456</p>
                    <p className="text-sm">Expires 12/25</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Nike Air Jordan 1"
                            width={64}
                            height={64}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Nike Air Jordan 1 Retro High OG</p>
                          <p className="text-sm text-muted-foreground">Size: US 10</p>
                          <p className="text-sm text-muted-foreground">Color: Chicago</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$170.00</p>
                          <p className="text-sm text-muted-foreground">Qty: 1</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Adidas Yeezy"
                            width={64}
                            height={64}
                            className="rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Adidas Yeezy Boost 350 V2</p>
                          <p className="text-sm text-muted-foreground">Size: US 9.5</p>
                          <p className="text-sm text-muted-foreground">Color: Zebra</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$220.00</p>
                          <p className="text-sm text-muted-foreground">Qty: 1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep("payment")}>
                  Back
                </Button>
                <Button className="flex-1">Place Order</Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  )
}
