
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Product } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const productCategories: Product['category'][] = ['Dresses', 'Accessories', 'Combos', 'Shirts', 'Pants', 'Sportswear', 'Formals', 'Casuals', 'Branded'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
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
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

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

  const handleDeleteProduct = async (productId: string) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      
      try {
          await deleteDoc(doc(db, 'products', productId));
          toast({
              title: "Product Deleted",
              description: "The product has been successfully deleted.",
          });
          fetchProducts();
      } catch (error) {
           toast({
              title: "Error",
              description: "Could not delete product.",
              variant: "destructive",
          });
          console.error("Error deleting product:", error);
      }
  };

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product?.image || null);
    setIsDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
  }

  const handleProductFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      const productData = Object.fromEntries(formData.entries()) as Omit<Product, 'id' | 'trending' | 'image'> & { price: string };

      let imageUrl = editingProduct?.image || '';

      try {
        if (imageFile) {
          const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
          const uploadResult = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(uploadResult.ref);
        }

        if (!imageUrl) {
            toast({ title: "Error", description: "An image is required.", variant: "destructive"});
            setIsSubmitting(false);
            return;
        }

        const dataToSave = {
            ...productData,
            price: parseFloat(productData.price),
            trending: editingProduct ? editingProduct.trending : false,
            image: imageUrl,
        };

          if (editingProduct) {
              const productRef = doc(db, 'products', editingProduct.id);
              await updateDoc(productRef, dataToSave);
              toast({ title: "Success", description: "Product updated successfully." });
          } else {
              await addDoc(collection(db, 'products'), dataToSave);
              toast({ title: "Success", description: "Product added successfully." });
          }
          fetchProducts();
          handleDialogClose();
      } catch (error) {
          console.error("Error saving product: ", error);
          toast({ title: "Error", description: "Could not save product.", variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
  }
  
  if (loading) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-headline">Manage Products</h1>
            </div>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline">Manage Products</h1>
         <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {editingProduct ? 'Update the details of the existing product.' : 'Fill in the details for the new product.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProductFormSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" defaultValue={editingProduct?.name} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" name="description" defaultValue={editingProduct?.description} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} className="col-span-3" required/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                         <Select name="category" defaultValue={editingProduct?.category} required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="image" className="text-right pt-2">Image</Label>
                        <div className="col-span-3 space-y-2">
                           <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && (
                                <Image
                                src={imagePreview}
                                alt="Product image preview"
                                width={100}
                                height={100}
                                className="rounded-md object-cover"
                                />
                            )}
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dataAiHint" className="text-right">AI Hint</Label>
                        <Input id="dataAiHint" name="dataAiHint" defaultValue={editingProduct?.dataAiHint} className="col-span-3" required/>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Product
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>


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
                    <TableHead className="text-right">Actions</TableHead>
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
                       <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
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

    