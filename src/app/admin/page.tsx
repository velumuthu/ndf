
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, Tag, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { seedProducts } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    bulkOrders: 0,
    offers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const bulkOrdersSnapshot = await getDocs(collection(db, 'bulk-orders'));
        const offersSnapshot = await getDocs(collection(db, 'offers'));

        setStats({
          products: productsSnapshot.size,
          bulkOrders: bulkOrdersSnapshot.size,
          offers: offersSnapshot.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  const handleSeed = async () => {
    toast({ title: 'Seeding...', description: 'Adding sample products to the database.' });
    try {
      await seedProducts();
      toast({ title: 'Success!', description: 'Database has been seeded with sample products.' });
      // Re-fetch stats after seeding
      const productsSnapshot = await getDocs(collection(db, 'products'));
      setStats(prev => ({...prev, products: productsSnapshot.size}));
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'There was an error seeding the database.', variant: 'destructive'});
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline mb-6">Admin Dashboard</h1>
        <Button onClick={handleSeed} variant="outline">Seed Dummy Products</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.products}</div>
            <p className="text-xs text-muted-foreground">Manage your store's inventory.</p>
             <Button asChild variant="link" className="px-0">
                <Link href="/admin/products">View Products</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulk Order Inquiries</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.bulkOrders}</div>
             <p className="text-xs text-muted-foreground">Review and respond to inquiries.</p>
              <Button asChild variant="link" className="px-0">
                <Link href="/admin/bulk-orders">View Inquiries</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.offers}</div>
            <p className="text-xs text-muted-foreground">Create and manage discounts.</p>
             <Button asChild variant="link" className="px-0">
                <Link href="/admin/offers">View Offers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
