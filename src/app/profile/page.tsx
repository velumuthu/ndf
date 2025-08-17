
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const ordersCollection = collection(db, 'orders');
      const q = query(
        ordersCollection,
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const orderSnapshot = await getDocs(q);
      const orderList = orderSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as Order;
      });
      setOrders(orderList);
    } catch (error) {
      console.error('Error fetching orders: ', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchOrders(user.uid);
    }
  }, [user, authLoading, router, fetchOrders]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-headline mb-2">Welcome, {user.displayName || 'User'}!</h1>
      <p className="text-muted-foreground mb-8">View your order history and check the status of your purchases.</p>

      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {orders.map(order => (
                <AccordionItem value={order.id!} key={order.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                      <div>
                        <p className="font-semibold">Order #{order.id?.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.totalPrice.toFixed(2)}</p>
                        <Badge variant={order.status === 'Shipped' ? 'default' : 'secondary'}>{order.status}</Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Ordered Items</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.cart.map((item, index) => (
                            <TableRow key={item.product.id + (item.size || index)}>
                              <TableCell><Image src={item.product.image} alt={item.product.name} width={40} height={50} className="rounded-md" /></TableCell>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell>{item.size || 'N/A'}</TableCell>
                              <TableCell>x {item.quantity}</TableCell>
                              <TableCell className="text-right">₹{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p>You haven't placed any orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
