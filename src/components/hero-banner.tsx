import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
      <Image
        src="/placeholder.svg?height=600&width=1200"
        alt="Latest sneaker releases"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-20 container h-full flex flex-col justify-center px-4">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">The Latest Drops</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Shop the newest and most exclusive sneaker releases from top brands. Authentic products guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              asChild
            >
              <Link href="/new-releases">New Releases</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
