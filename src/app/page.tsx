
'use client';

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('/api/products/trending');
        setTrendingProducts(response.data);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingProducts();
  }, []);


  return (
    <div className="space-y-24 md:space-y-32">
      <section className="text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-headline text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter">
          <span className="block text-4xl md:text-6xl lg:text-7xl font-medium tracking-normal text-muted-foreground">Namma Dream Fashion</span>
          Style Redefined.
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-muted-foreground">
          Discover curated fashion that blends timeless elegance with modern edge.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full font-bold">
          <Link href="/shop">Explore Collection</Link>
        </Button>
      </section>

      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Trending Now</h2>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary">
             <Link href="/shop">Shop All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <Skeleton className="h-[450px] w-full" />
                <Skeleton className="h-[450px] w-full" />
                <Skeleton className="h-[450px] w-full" />
                <Skeleton className="h-[450px] w-full" />
            </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {trendingProducts.map((product) => (
                <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </section>
      
      <section className="text-center">
         <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">For Every Occasion</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            From chic day dresses to show-stopping evening gowns, our collections are designed to make you feel beautiful and confident, no matter the event.
          </p>
      </section>
    </div>
  );
}
