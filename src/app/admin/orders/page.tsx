
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, doc, updateDoc } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const ordersCollection = collection(db, 'orders');
      const q = query(ordersCollection, orderBy('createdAt', 'desc'));
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
      toast({
        title: 'Error',
        description: 'Could not fetch orders.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const handleStatusChange = async (orderId: string, status: string) => {
    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, { status });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast({ title: "Success", description: "Order status updated." });
    } catch (error) {
      console.error('Error updating order status: ', error);
      toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-headline mb-6">Manage Orders</h1>
        <Card>
          <CardHeader>
            <CardTitle>All Customer Orders</CardTitle>
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
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-headline mb-6">Manage Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Customer Orders</CardTitle>
           <CardDescription>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {orders.map(order => (
              <AccordionItem value={order.id!} key={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <div>
                      <p className="font-semibold">{order.shippingInfo.name}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Shipping Details</h4>
                          <p>{order.shippingInfo.name}</p>
                           <p>{order.shippingInfo.phone || 'N/A'}</p>
                          <p>{order.shippingInfo.address}</p>
                          <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Update Status</h4>
                           <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id!, value)}>
                              <SelectTrigger>
                                  <SelectValue placeholder="Set status" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Shipped">Shipped</SelectItem>
                                  <SelectItem value="Delivered">Delivered</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                          </Select>
                        </div>
                    </div>

                    <h4 className="font-semibold mt-6 mb-2">Ordered Items</h4>
                     <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.cart.map(item => (
                            <TableRow key={item.product.id}>
                               <TableCell><Image src={item.product.image} alt={item.product.name} width={40} height={50} className="rounded-md" /></TableCell>
                               <TableCell>{item.product.name}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
