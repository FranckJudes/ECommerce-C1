import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Users, Network } from "lucide-react"

const features = [
  {
    title: "Inscription en 10 secondes",
    description: "Scanner le QR code et connectez-vous avec LinkedIn pour participer à l'événement.",
    icon: QrCode,
  },
  {
    title: "Liste des participants",
    description: "Accédez à la liste complète des participants et leurs profils professionnels.",
    icon: Users,
  },
  {
    title: "Networking facilité",
    description: "Connectez-vous instantanément avec les autres participants via LinkedIn.",
    icon: Network,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Le networking enfin simplifié !</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="card-hover">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

