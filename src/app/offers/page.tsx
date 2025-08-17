'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Offer } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Tag } from "lucide-react";

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const q = query(collection(db, "offers"), where("active", "==", true));
                const querySnapshot = await getDocs(q);
                const offersList = querySnapshot.docs.map(doc => doc.data() as Offer);
                setOffers(offersList);
            } catch (error) {
                console.error("Error fetching offers:", error);
                toast({
                    title: "Error",
                    description: "Could not fetch offers.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, [toast]);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Copied!",
            description: "Coupon code copied to clipboard."
        });
    }

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline tracking-tight">Special Offers</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Check out our latest deals and discounts. Use these codes at checkout!
                </p>
            </div>

            {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="h-48 animate-pulse bg-muted"></Card>
                    <Card className="h-48 animate-pulse bg-muted"></Card>
                    <Card className="h-48 animate-pulse bg-muted"></Card>
                 </div>
            ) : offers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <Card key={offer.id} className="bg-card flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <Tag className="h-8 w-8 text-primary" />
                                     <div className="text-right">
                                        <CardTitle className="text-2xl font-bold text-primary">{offer.discountPercentage}% OFF</CardTitle>
                                        <p className="font-semibold">{offer.title}</p>
                                     </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{offer.description}</CardDescription>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button className="w-full" onClick={() => handleCopyCode(offer.couponCode)}>
                                    Copy Code: <span className="font-mono ml-2 p-1 bg-primary-foreground/20 rounded-md">{offer.couponCode}</span>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-lg">
                    <h2 className="text-2xl font-semibold">No active offers</h2>
                    <p className="mt-2 text-muted-foreground">Please check back later for new deals.</p>
                </div>
            )}
        </div>
    );
}
