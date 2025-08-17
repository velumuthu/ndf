'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { StylistInquiry } from '@/lib/types';
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

export default function AdminStylistInquiriesPage() {
  const [inquiries, setInquiries] = useState<StylistInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const inquiriesCollection = collection(db, 'stylist-inquiries');
      const q = query(inquiriesCollection, orderBy('createdAt', 'desc'));
      const inquirySnapshot = await getDocs(q);
      const inquiryList = inquirySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as StylistInquiry;
      });
      setInquiries(inquiryList);
    } catch (error) {
      console.error('Error fetching stylist inquiries: ', error);
      toast({
        title: 'Error',
        description: 'Could not fetch stylist inquiries.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-headline">Manage Stylist Inquiries</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Stylist Inquiries</CardTitle>
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
        <h1 className="text-3xl font-headline">Manage Stylist Inquiries</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stylist Inquiries</CardTitle>
           <CardDescription>
            {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'} found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Occasion</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map(inquiry => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                   <TableCell>{inquiry.email}</TableCell>
                   <TableCell>{inquiry.occasion}</TableCell>
                  <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
