
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/components/cart-provider';
import { ProductCard } from '@/components/product-card';
import { ShoppingCart, Zap, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          
          if(productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }

          // Fetch recommended products
          const q = query(
            collection(db, "products"),
            where("category", "==", productData.category),
            where("id", "!=", id),
            limit(4)
          );
          const querySnapshot = await getDocs(q);
          const recs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setRecommendedProducts(recs);

        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      if (product.sizes?.length > 0 && !selectedSize) {
        alert("Please select a size.");
        return;
      }
      addToCart(product, 1, selectedSize || undefined);
    }
  };

  const handleOrderNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="w-full h-[600px] rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>
        <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={1000}
            className="w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-headline font-bold">{product.name}</h1>
           <div>
            <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
            <span className="ml-2 text-muted-foreground">({product.stock} available)</span>
          </div>
          <p className="text-3xl font-semibold">₹{product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          {product.sizes?.length > 0 && (
             <div className="space-y-2">
                <Label className="text-lg font-medium">Size</Label>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                        <Button
                            key={size}
                            variant={selectedSize === size ? 'default' : 'outline'}
                            onClick={() => setSelectedSize(size)}
                            disabled={product.stock === 0}
                        >
                            {size}
                        </Button>
                    ))}
                </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
             <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="mr-2 h-5 w-5"/> Add to Cart
             </Button>
             <Button size="lg" variant="default" className="w-full" onClick={handleOrderNow} disabled={product.stock === 0}>
                <Zap className="mr-2 h-5 w-5"/> Order Now
             </Button>
          </div>
        </div>
      </div>
      
      {recommendedProducts.length > 0 && (
        <div className="mt-24">
            <Separator className="my-12"/>
            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-center mb-10">You Might Also Like</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendedProducts.map(recProduct => (
                    <ProductCard key={recProduct.id} product={recProduct} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
