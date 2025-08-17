'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { BulkOrder } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBulkOrdersPage() {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBulkOrders = useCallback(async () => {
    setLoading(true);
    try {
      const ordersCollection = collection(db, 'bulk-orders');
      const q = query(ordersCollection, orderBy('createdAt', 'desc'));
      const orderSnapshot = await getDocs(q);
      const orderList = orderSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as BulkOrder;
      });
      setOrders(orderList);
    } catch (error) {
      console.error('Error fetching bulk orders: ', error);
      toast({
        title: 'Error',
        description: 'Could not fetch bulk orders.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBulkOrders();
  }, [fetchBulkOrders]);

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-headline">Manage Bulk Orders</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Bulk Order Inquiries</CardTitle>
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
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline">Manage Bulk Orders</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bulk Order Inquiries</CardTitle>
           <CardDescription>
            {orders.length} {orders.length === 1 ? 'inquiry' : 'inquiries'} found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{order.name}</TableCell>
                   <TableCell>{order.email}</TableCell>
                   <TableCell>{order.phone || 'N/A'}</TableCell>
                   <TableCell>{order.quantity}</TableCell>
                  <TableCell className="max-w-xs truncate">{order.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
