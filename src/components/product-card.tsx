
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
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from './ui/label';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const hasSizes = product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === '');


  const handleOrderNow = () => {
    if (hasSizes) {
       // Open dialog if there are sizes, which will then handle the logic
       // This is handled by DialogTrigger, but we keep this function for clarity
    } else {
      addToCart(product, 1, undefined);
      router.push('/cart');
    }
  };

  const handleAddToCart = () => {
    if (hasSizes) {
      // DialogTrigger handles opening the dialog
    } else {
      addToCart(product, 1, undefined);
    }
  };

  const handleConfirmSize = (action: 'cart' | 'order') => {
    if (product && selectedSize) {
      addToCart(product, 1, selectedSize);
      setIsDialogOpen(false);
      setSelectedSize(null);
      if (action === 'order') {
        router.push('/cart');
      }
    } else {
        alert("Please select a size.");
    }
  };

  const renderProductCard = () => (
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
              onClick={handleAddToCart}
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
  )

  if (hasSizes) {
    return (
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {renderProductCard()}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Select a Size</DialogTitle>
                <DialogDescription>
                    Please choose a size for {product.name}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                 <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                        <Button
                            key={size}
                            variant={selectedSize === size ? 'default' : 'outline'}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </Button>
                    ))}
                </div>
            </div>
            <DialogFooter className="sm:justify-between gap-2">
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <div className="flex gap-2">
                    <Button type="button" onClick={() => handleConfirmSize('cart')} disabled={!selectedSize}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    <Button type="button" onClick={() => handleConfirmSize('order')} disabled={!selectedSize}>
                        <Zap className="mr-2 h-4 w-4" /> Order Now
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return renderProductCard();
}
