import Image from "next/image"
import { Button } from "@/components/ui/button"

export function QrCodeSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Testez les fonctionnalités clés d &apos;Adsun</h2>
            <p className="text-lg">
              Utilisez votre smartphone pour scanner le QR code ci-contre et accédez immédiatement à la version démo
              d&apos;Adsun. Vous découvrirez en temps réel comment l&apos;inscription rapide via QR code simplifie l&apos;accueil des
              participants.
            </p>
            <Button variant="secondary" size="lg">
              En savoir plus
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/placeholder.svg"
              alt="QR Code Adsun"
              width={300}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

