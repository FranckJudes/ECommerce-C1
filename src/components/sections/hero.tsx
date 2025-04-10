import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient text-white min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="font-outfit text-4xl md:text-6xl font-bold leading-tight">
              Le networking simplifié pour les événements professionnels
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Connectez-vous facilement avec les autres participants grâce à notre système de QR code unique.
            </p>
            <Button size="lg" variant="secondary" className="rounded-full">
              Organiser un événement
            </Button>
          </div>
          <div className="relative h-[600px] hidden md:block">
            <Image src="/placeholder.svg" alt="Application mobile Adsun" fill className="object-contain" priority />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

