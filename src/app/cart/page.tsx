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

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase. A confirmation has been sent to your email.',
    });
    clearCart();
  };
  
  return (
    <div className="grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2">
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
              <Card key={item.product.id} className="flex items-center p-4 bg-background">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={100}
                  height={120}
                  className="rounded-md object-cover"
                  data-ai-hint={item.product.dataAiHint}
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
             <Separator />
             <div className="space-y-2">
                <h3 className="font-semibold">Shipping Information</h3>
                <Input placeholder="Full Name" />
                <Input placeholder="Address" />
                <Input placeholder="City" />
                <div className="flex gap-2">
                    <Input placeholder="State" />
                    <Input placeholder="ZIP Code" />
                </div>
             </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
