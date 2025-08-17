'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from "@/components/auth-provider";
import { Info } from "lucide-react";
import Link from "next/link";


export default function BulkOrderPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, 'bulk-orders'), {
        ...data,
        createdAt: serverTimestamp(),
        userId: user?.uid,
      });
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your interest. We will get back to you within 2-3 business days.",
      });
      form.reset();
    } catch (error) {
       console.error("Error submitting inquiry: ", error);
       toast({
        title: "Error",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
       <div className="text-center py-16 bg-card rounded-lg max-w-2xl mx-auto">
          <Info className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold">Please Log In</h2>
          <p className="mt-2 text-muted-foreground">You need to be logged in to submit a bulk order inquiry.</p>
          <Button asChild className="mt-6">
            <Link href="/login">Login or Sign Up</Link>
          </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-headline">Bulk Order Inquiry</CardTitle>
          <CardDescription className="text-lg">
            Interested in placing a large order for your business or event? Fill out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input id="company" name="company" placeholder="Fashion Corp" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="jane.doe@example.com" required defaultValue={user?.email || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(123) 456-7890" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="quantity">Estimated Quantity</Label>
                <Input id="quantity" name="quantity" type="number" placeholder="100" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Desired Delivery Date</Label>
                <Input id="delivery-date" name="deliveryDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Inquiry Details</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Please tell us about the products and quantities you are interested in."
                className="min-h-[150px]"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">Submit Inquiry</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}