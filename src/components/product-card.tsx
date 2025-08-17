
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useCart } from './cart-provider';
import type { Product } from '@/lib/types';
import { ShoppingCart, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleOrderNow = () => {
    addToCart(product);
    router.push('/cart');
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full group transition-all duration-300 border-0 bg-transparent shadow-none rounded-none">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={800}
            className="w-full h-auto object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={product.dataAiHint}
          />
        </Link>
        {product.stock === 0 && <Badge variant="destructive" className="absolute top-3 right-3">Out of Stock</Badge>}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-base sm:text-lg font-semibold leading-snug">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-base sm:text-lg font-bold text-foreground mt-2">
          ₹{product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex flex-col items-center gap-2">
            <Button
              onClick={() => addToCart(product)}
              variant="secondary"
              className="w-full font-bold"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
             <Button
              onClick={handleOrderNow}
              variant="default"
              className="w-full font-bold"
              disabled={product.stock === 0}
            >
              <Zap className="mr-2 h-4 w-4" />
              Order Now
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

    