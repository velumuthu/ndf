'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
        toast({
            title: "Error",
            description: "Could not fetch products.",
            variant: "destructive"
        })
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleTrendingToggle = async (productId: string, currentStatus: boolean) => {
    const productRef = doc(db, 'products', productId);
    try {
      await updateDoc(productRef, {
        trending: !currentStatus
      });
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, trending: !currentStatus } : p
        )
      );
      toast({
          title: "Success",
          description: `Product trending status updated.`,
      })
    } catch (error) {
      console.error("Error updating product: ", error);
       toast({
        title: "Error",
        description: "Could not update product status.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
        <div>
            <h1 className="text-3xl font-headline mb-6">Manage Products</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-headline mb-6">Manage Products</h1>
      <Card>
          <CardHeader>
              <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Trending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                          <Image src={product.image} alt={product.name} width={60} height={80} className="rounded-md object-cover" />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                       <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id={`trending-switch-${product.id}`}
                                checked={product.trending}
                                onCheckedChange={() => handleTrendingToggle(product.id, product.trending)}
                            />
                            <Label htmlFor={`trending-switch-${product.id}`}>{product.trending ? 'Yes' : 'No'}</Label>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
}
