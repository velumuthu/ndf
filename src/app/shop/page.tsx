
'use client';

import { ProductCard } from '@/components/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline tracking-tight">Our Collection</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore our hand-picked selection of dresses, accessories, and curated sets.
        </p>
      </div>

       {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
            <Skeleton className="h-[350px] md:h-[450px] w-full" />
        </div>
       ) : (
         <Tabs defaultValue="All" className="w-full">
            <div className="flex justify-center">
              <ScrollArea className="w-full max-w-full whitespace-nowrap rounded-lg">
                <TabsList className="inline-flex">
                  {categories.map(category => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            
            <TabsContent value="All">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            {categories.slice(1).map(category => (
               <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
                  {products.filter(p => p.category === category).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
       )}
    </div>
  );
}
