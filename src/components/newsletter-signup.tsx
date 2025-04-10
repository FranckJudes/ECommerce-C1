import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Subscribe to our newsletter to get updates on new releases, restocks, exclusive offers, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input placeholder="Your email address" className="flex-1" />
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  )
}
