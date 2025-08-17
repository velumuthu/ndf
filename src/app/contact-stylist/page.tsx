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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContactStylistPage() {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, 'stylist-inquiries'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. A stylist will be in touch with you shortly.",
      });
      form.reset();
    } catch (error) {
       console.error("Error submitting inquiry: ", error);
       toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-headline">Contact a Stylist</CardTitle>
          <CardDescription className="text-lg">
            Need help finding the perfect outfit? Our expert stylists are here to assist you.
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
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="jane.doe@example.com" required />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="occasion">What's the occasion?</Label>
                 <Select name="occasion" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an occasion" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="party">Party / Social Event</SelectItem>
                        <SelectItem value="work">Work / Professional</SelectItem>
                        <SelectItem value="vacation">Vacation</SelectItem>
                        <SelectItem value="everyday">Everyday Style</SelectItem>
                         <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">What are you looking for?</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us a bit about your style, what you're looking for, or any specific pieces you have in mind."
                className="min-h-[150px]"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
