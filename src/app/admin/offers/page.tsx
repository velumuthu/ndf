'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, setDoc } from 'firebase/firestore';
import type { Offer } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
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

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const offersCollection = collection(db, 'offers');
      const offerSnapshot = await getDocs(offersCollection);
      const offerList = offerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
      setOffers(offerList);
    } catch (error) {
      console.error("Error fetching offers: ", error);
      toast({
          title: "Error",
          description: "Could not fetch offers.",
          variant: "destructive"
      })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

   const handleActiveToggle = async (offerId: string, currentStatus: boolean) => {
    const offerRef = doc(db, 'offers', offerId);
    try {
      await updateDoc(offerRef, { active: !currentStatus });
      fetchOffers(); // Refetch to get updated list
      toast({ title: "Success", description: `Offer status updated.` });
    } catch (error) {
      console.error("Error updating offer: ", error);
      toast({ title: "Error", description: "Could not update offer status.", variant: "destructive" });
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
      if (!window.confirm("Are you sure you want to delete this offer?")) return;
      
      try {
          await deleteDoc(doc(db, 'offers', offerId));
          toast({ title: "Offer Deleted", description: "The offer has been successfully deleted." });
          fetchOffers();
      } catch (error) {
           toast({ title: "Error", description: "Could not delete offer.", variant: "destructive" });
           console.error("Error deleting offer:", error);
      }
  };

  const handleOpenDialog = (offer: Offer | null = null) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingOffer(null);
  }

  const handleOfferFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const offerData = Object.fromEntries(formData.entries()) as Omit<Offer, 'id' | 'active'> & { discountPercentage: string };

      const dataToSave = {
          ...offerData,
          discountPercentage: parseInt(offerData.discountPercentage, 10),
          active: editingOffer ? editingOffer.active : true,
      };

      try {
          if (editingOffer) {
              const offerRef = doc(db, 'offers', editingOffer.id);
              await updateDoc(offerRef, dataToSave);
              toast({ title: "Success", description: "Offer updated successfully." });
          } else {
              // The document ID will be the coupon code
              const offerRef = doc(db, 'offers', dataToSave.couponCode);
              await setDoc(offerRef, {...dataToSave, id: dataToSave.couponCode });
              toast({ title: "Success", description: "Offer added successfully." });
          }
          fetchOffers();
          handleDialogClose();
      } catch (error) {
          console.error("Error saving offer: ", error);
          toast({ title: "Error", description: "Could not save offer.", variant: "destructive" });
      }
  }

  if (loading) {
      return (
          <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-headline">Manage Offers</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Offers & Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
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
        <h1 className="text-3xl font-headline">Manage Offers</h1>
         <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Offer
        </Button>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
                    <DialogDescription>
                        {editingOffer ? 'Update the details of the existing offer.' : 'Fill in the details for the new offer.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleOfferFormSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" name="title" defaultValue={editingOffer?.title} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" name="description" defaultValue={editingOffer?.description} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="couponCode" className="text-right">Coupon Code</Label>
                        <Input id="couponCode" name="couponCode" defaultValue={editingOffer?.couponCode} className="col-span-3" required disabled={!!editingOffer}/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discountPercentage" className="text-right">Discount %</Label>
                        <Input id="discountPercentage" name="discountPercentage" type="number" step="1" defaultValue={editingOffer?.discountPercentage} className="col-span-3" required/>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleDialogClose}>Cancel</Button>
                        <Button type="submit">Save Offer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>


      <Card>
          <CardHeader>
              <CardTitle>All Offers & Coupons</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Coupon Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map(offer => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell><pre className="bg-muted p-1 rounded-md inline-block">{offer.couponCode}</pre></TableCell>
                       <TableCell>{offer.discountPercentage}%</TableCell>
                      <TableCell>
                         <div className="flex items-center space-x-2">
                            <Switch
                                id={`active-switch-${offer.id}`}
                                checked={offer.active}
                                onCheckedChange={() => handleActiveToggle(offer.id, offer.active)}
                            />
                            <Label htmlFor={`active-switch-${offer.id}`}>{offer.active ? 'Yes' : 'No'}</Label>
                        </div>
                      </TableCell>
                       <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(offer)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteOffer(offer.id)}>
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
