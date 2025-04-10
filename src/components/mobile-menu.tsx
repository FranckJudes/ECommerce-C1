import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface MobileMenuProps {
  navItems: {
    label: string
    href: string
  }[]
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  return (
    <div className="flex flex-col h-full py-6">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">SneakerX</span>
        </Link>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>

      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="categories">
          <AccordionTrigger className="py-2">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 pl-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/categories/running">Running</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/categories/basketball">Basketball</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/categories/lifestyle">Lifestyle</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/categories/skateboarding">Skateboarding</Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger className="py-2">Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 pl-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/brands/nike">Nike</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/brands/adidas">Adidas</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/brands/jordan">Jordan</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/brands/new-balance">New Balance</Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-auto space-y-4">
        <Button className="w-full" asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/sign-up">Create Account</Link>
        </Button>
      </div>
    </div>
  )
}
