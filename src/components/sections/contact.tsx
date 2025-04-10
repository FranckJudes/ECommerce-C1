import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Contactez-nous</h2>
        <form className="max-w-lg mx-auto space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Votre nom
            </label>
            <Input id="name" placeholder="Entrez votre nom" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Votre adresse e-mail
            </label>
            <Input id="email" type="email" placeholder="Entrez votre e-mail" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Votre message
            </label>
            <Textarea id="message" placeholder="Écrivez votre message ici" rows={5} />
          </div>
          <Button type="submit" className="w-full">
            Envoyer votre demande
          </Button>
        </form>
      </div>
    </section>
  )
}

