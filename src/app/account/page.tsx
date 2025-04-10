import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccountProfile from "@/components/account-profile"
import OrderHistory from "@/components/order-history"
import SavedItems from "@/components/saved-items"
import PaymentMethods from "@/components/payment-methods"
import AddressBook from "@/components/address-book"

export default function AccountPage() {
  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/auth/sign-in">Sign Out</Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto mb-8">
          <TabsTrigger value="profile" className="flex-1">
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex-1">
            Orders
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            Saved Items
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1">
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex-1">
            Addresses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <AccountProfile />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>

        <TabsContent value="saved">
          <SavedItems />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethods />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressBook />
        </TabsContent>
      </Tabs>
    </div>
  )
}
