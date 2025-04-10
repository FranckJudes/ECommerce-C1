"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import CartDrawer from "@/components/cart-drawer"
import ProductSearch from "@/components/product-search"
import { Menu, User } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="block px-2 py-1 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link
                href="/products"
                className="block px-2 py-1 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/new-releases"
                className="block px-2 py-1 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                New Releases
              </Link>
              <Link href="/brands" className="block px-2 py-1 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Brands
              </Link>
              <Link href="/sale" className="block px-2 py-1 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Sale
              </Link>
            </nav>
            <div className="mt-6">
              <Input placeholder="Search..." className="w-full" />
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Button asChild onClick={() => setIsMenuOpen(false)}>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild onClick={() => setIsMenuOpen(false)}>
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">SneakerX</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/products" className="transition-colors hover:text-foreground/80">
            Products
          </Link>
          <Link href="/new-releases" className="transition-colors hover:text-foreground/80">
            New Releases
          </Link>
          <Link href="/brands" className="transition-colors hover:text-foreground/80">
            Brands
          </Link>
          <Link href="/sale" className="transition-colors hover:text-foreground/80">
            Sale
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          <ProductSearch />
          <CartDrawer />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
