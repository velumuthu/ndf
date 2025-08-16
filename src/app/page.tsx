import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const trendingProducts = products.filter(p => p.trending);

  return (
    <div className="space-y-16">
      <section className="relative text-center bg-card p-8 md:p-16 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 z-0"></div>
        <div className="relative z-10">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl tracking-tight text-primary-foreground/80">
            Timeless Elegance, Modern Style
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Discover our curated collection of fashion that transcends seasons.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/shop">Explore the Collection</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl md:text-4xl text-center mb-10">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-headline text-3xl md:text-4xl">For Every Occasion</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From chic day dresses to show-stopping evening gowns, our collections are designed to make you feel beautiful and confident, no matter the event. Experience the luxury of fine fabrics and impeccable tailoring.
          </p>
          <Button asChild variant="link" className="mt-4 text-primary p-0 text-lg">
             <Link href="/shop">Shop All Categories &rarr;</Link>
          </Button>
        </div>
        <div className="bg-card rounded-lg p-4">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Woman in an elegant dress"
            width={600}
            height={400}
            className="rounded-md object-cover"
            data-ai-hint="elegant dress"
          />
        </div>
      </section>
    </div>
  );
}
