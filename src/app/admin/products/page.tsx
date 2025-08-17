
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, writeBatch } from 'firebase/firestore';
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
import { PlusCircle, Trash2, Edit, Loader2, Upload } from 'lucide-react';
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
import Papa from 'papaparse';


const productCategories: Product['category'][] = ['Dresses', 'Accessories', 'Combos', 'Shirts', 'Pants', 'Sportswear', 'Formals', 'Casuals', 'Branded'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);


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

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.target.value);
    setImagePreview(e.target.value);
  }

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
    setImagePreview(product?.image || null);
    setImageUrlInput(product?.image || '');
    setIsDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setImagePreview(null);
    setImageUrlInput('');
  }

  const handleProductFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      const productData = Object.fromEntries(formData.entries()) as Omit<Product, 'id' | 'trending' | 'image' | 'price' | 'stock' | 'sizes'> & { price: string, stock: string, sizes: string };

      let finalImageUrl = editingProduct?.image || '';

      try {
        if (imageUrlInput) {
            finalImageUrl = imageUrlInput;
        }

        if (!finalImageUrl) {
            toast({ title: "Error", description: "An image URL is required.", variant: "destructive"});
            setIsSubmitting(false);
            return;
        }

        const dataToSave = {
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock, 10),
            sizes: productData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            category: productData.category,
            dataAiHint: productData.dataAiHint,
            trending: editingProduct ? editingProduct.trending : false,
            image: finalImageUrl,
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

    const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            toast({ title: "No file selected", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const productsToAdd = results.data as any[];

                if (productsToAdd.length === 0) {
                    toast({ title: "CSV is empty or invalid", variant: "destructive" });
                    setIsSubmitting(false);
                    return;
                }

                try {
                    const batch = writeBatch(db);
                    let count = 0;

                    for (const prod of productsToAdd) {
                        // Basic validation
                        if (!prod.name || !prod.price || !prod.category || !prod.image) {
                            console.warn("Skipping invalid row:", prod);
                            continue;
                        }

                        const newProductRef = doc(collection(db, "products"));
                        const newProduct: Omit<Product, 'id'> = {
                            name: prod.name,
                            description: prod.description || '',
                            price: parseFloat(prod.price),
                            stock: parseInt(prod.stock || '0', 10),
                            sizes: prod.sizes ? prod.sizes.split(',').map((s: string) => s.trim()) : [],
                            category: prod.category as Product['category'],
                            dataAiHint: prod.dataAiHint || prod.name.toLowerCase().split(' ').slice(0, 2).join(' '),
                            trending: prod.trending ? prod.trending.toLowerCase() === 'true' : false,
                            image: prod.image,
                        };
                        batch.set(newProductRef, newProduct);
                        count++;
                    }

                    if (count > 0) {
                        await batch.commit();
                        toast({ title: "Success!", description: `${count} products have been added successfully.` });
                        fetchProducts();
                    } else {
                        toast({ title: "No valid products found", description: "Please check your CSV file format.", variant: "destructive" });
                    }

                } catch (error) {
                    console.error("Error batch adding products: ", error);
                    toast({ title: "Error", description: "Could not add products from CSV.", variant: "destructive" });
                } finally {
                    setIsSubmitting(false);
                    // Reset file input
                    if(fileInputRef.current) fileInputRef.current.value = '';
                }
            },
            error: (error: any) => {
                toast({ title: "CSV Parsing Error", description: error.message, variant: "destructive" });
                setIsSubmitting(false);
            }
        });
    };

    const triggerCsvUpload = () => {
        fileInputRef.current?.click();
    };
  
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
      <div className="flex justify-between items-center mb-6 gap-2">
        <h1 className="text-3xl font-headline">Manage Products</h1>
         <div className="flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handleCsvUpload} accept=".csv" className="hidden" disabled={isSubmitting}/>
            <Button onClick={triggerCsvUpload} variant="outline" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Import from CSV
            </Button>
            <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[525px] grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                        {editingProduct ? 'Update the details of the existing product.' : 'Fill in the details for the new product.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto pr-6">
                  <form id="product-form" onSubmit={handleProductFormSubmit} className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input id="name" name="name" defaultValue={editingProduct?.name} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">Description</Label>
                          <Textarea id="description" name="description" defaultValue={editingProduct?.description} className="col-span-3 min-h-[100px] md:min-h-[100px]" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">Price</Label>
                          <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} className="col-span-3" required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="stock" className="text-right">Stock</Label>
                          <Input id="stock" name="stock" type="number" step="1" defaultValue={editingProduct?.stock ?? 0} className="col-span-3" required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sizes" className="text-right">Sizes</Label>
                          <Input id="sizes" name="sizes" placeholder="S, M, L, XL" defaultValue={editingProduct?.sizes?.join(', ')} className="col-span-3" required/>
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
                          <Label htmlFor="imageUrl" className="text-right pt-2">Image URL</Label>
                          <div className="col-span-3 space-y-2">
                              <Input 
                                  id="imageUrl" 
                                  name="imageUrl" 
                                  type="text" 
                                  placeholder="Paste image URL" 
                                  value={imageUrlInput}
                                  onChange={handleImageUrlChange} 
                                  className="col-span-3"
                              />
                              {imagePreview && (
                                  <Image
                                  src={imagePreview}
                                  alt="Product image preview"
                                  width={100}
                                  height={100}
                                  className="rounded-md object-cover mt-2"
                                  />
                              )}
                          </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dataAiHint" className="text-right">AI Hint</Label>
                          <Input id="dataAiHint" name="dataAiHint" defaultValue={editingProduct?.dataAiHint} className="col-span-3" required/>
                      </div>
                  </form>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" form="product-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


      <Card>
          <CardHeader>
              <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
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
                      <TableCell>₹{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock > 0 ? product.stock : <Badge variant="destructive">Out</Badge>}</TableCell>
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
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
