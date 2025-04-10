import { Button } from "@/components/ui/button"
import FeaturedProducts from "@/components/featured-products"
import TrendingBrands from "@/components/trending-brands"
import PopularCategories from "@/components/popular-categories"
import HeroBanner from "@/components/hero-banner"
import NewsletterSignup from "@/components/newsletter-signup"

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroBanner />

      <section className="container px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Popular Categories</h2>
        <PopularCategories />
      </section>

      <section className="container px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline">View All</Button>
        </div>
        <FeaturedProducts />
      </section>

      <section className="container px-4 py-8 bg-muted/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Trending Brands</h2>
          <Button variant="outline">View All Brands</Button>
        </div>
        <TrendingBrands />
      </section>

      <NewsletterSignup />
    </div>
  )
}
