
'use client';

import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { Offer } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice);

  useEffect(() => {
    setFinalPrice(totalPrice * (1 - discount));
  }, [totalPrice, discount]);
  
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({ ...prev, name: user.displayName || '', email: user.email || '' }));
    }
  }, [user]);

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast({ title: "Please enter a coupon code.", variant: "destructive" });
      return;
    }
    try {
      const offerDoc = await getDoc(doc(db, 'offers', couponCode));
      if (offerDoc.exists()) {
        const offer = offerDoc.data() as Offer;
        if (offer.active) {
            setDiscount(offer.discountPercentage / 100);
            toast({ title: "Coupon Applied!", description: `${offer.discountPercentage}% off your order.` });
        } else {
            toast({ title: "Coupon is not active.", variant: "destructive" });
        }
      } else {
        toast({ title: "Invalid coupon code.", variant: "destructive" });
      }
    } catch (error) {
        console.error("Error applying coupon: ", error);
        toast({ title: "Error applying coupon.", variant: "destructive" });
    }
  };


  const handlePlaceOrder = async () => {
     if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to place an order.',
        variant: 'destructive',
      });
      router.push('/login?redirect=/cart');
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }
    
    if (Object.values(shippingInfo).some(val => val.trim() === '')) {
      toast({
        title: 'Missing Shipping Information',
        description: 'Please fill out all shipping fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        cart,
        totalPrice: finalPrice,
        shippingInfo,
        status: 'Pending',
        createdAt: serverTimestamp(),
        userId: user ? user.uid : null,
      });
      toast({
        title: 'Order Placed!',
        description: 'Your cash on delivery order has been confirmed. We will contact you shortly.',
      });
      clearCart();
      setShippingInfo({ name: '', phone: '', address: '', city: '', state: '', zip: '' });
      setCouponCode('');
      setDiscount(0);
      router.push('/profile');
    } catch (error) {
      console.error("Error placing order: ", error);
      toast({
        title: 'Error',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-headline mb-6">Your Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <Card key={item.product.id + (item.size || '')} className="flex items-center p-4 bg-background">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={80}
                  height={100}
                  className="rounded-md object-cover"
                  data-ai-hint={item.product.dataAiHint}
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold text-sm sm:text-base">{item.product.name}</h3>
                   {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                  <p className="text-sm text-muted-foreground">₹{item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="ml-2 sm:ml-4 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id, item.size)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <Card className="bg-card sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-destructive">
                <span>Discount</span>
                <span>-₹{(totalPrice - finalPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <Separator />
             <div className="flex gap-2">
                <Input placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <Button onClick={handleApplyCoupon}>Apply</Button>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalPrice.toFixed(2)}</span>
            </div>
             <Separator />
             <div className="space-y-2">
                <h3 className="font-semibold">Shipping Information</h3>
                <Input name="name" placeholder="Full Name" value={shippingInfo.name} onChange={handleShippingInfoChange} required />
                <Input name="phone" placeholder="Mobile Number" value={shippingInfo.phone} onChange={handleShippingInfoChange} required />
                <Input name="address" placeholder="Address" value={shippingInfo.address} onChange={handleShippingInfoChange} required />
                <Input name="city" placeholder="City" value={shippingInfo.city} onChange={handleShippingInfoChange} required />
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input name="state" placeholder="State" value={shippingInfo.state} onChange={handleShippingInfoChange} required />
                    <Input name="zip" placeholder="ZIP Code" value={shippingInfo.zip} onChange={handleShippingInfoChange} required />
                </div>
             </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full" size="lg" disabled={!totalPrice}>Confirm Cash on Delivery Order</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are placing a Cash on Delivery order. Total: ₹{finalPrice.toFixed(2)}.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePlaceOrder}>Confirm Order</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
