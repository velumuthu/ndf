
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, writeBatch, where, query } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const notificationsCollection = collection(db, 'notifications');
      const notificationSnapshot = await getDocs(notificationsCollection);
      const notificationList = notificationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notificationList);
    } catch (error) {
      console.error("Error fetching notifications: ", error);
      toast({
          title: "Error",
          description: "Could not fetch notifications.",
          variant: "destructive"
      })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleActiveToggle = async (notificationId: string, currentStatus: boolean) => {
    const batch = writeBatch(db);

    try {
      // Deactivate all other notifications if we are activating this one
      if (!currentStatus) {
        const q = query(collection(db, "notifications"), where("active", "==", true));
        const activeDocs = await getDocs(q);
        activeDocs.forEach(document => {
            const docRef = doc(db, 'notifications', document.id);
            batch.update(docRef, { active: false });
        });
      }

      // Toggle the current notification's status
      const notificationRef = doc(db, 'notifications', notificationId);
      batch.update(notificationRef, { active: !currentStatus });
      
      await batch.commit();

      fetchNotifications();
      toast({ title: "Success", description: `Notification status updated.` });
    } catch (error) {
      console.error("Error updating notification: ", error);
      toast({ title: "Error", description: "Could not update notification status.", variant: "destructive" });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
      if (!window.confirm("Are you sure you want to delete this notification?")) return;
      
      try {
          await deleteDoc(doc(db, 'notifications', notificationId));
          toast({ title: "Notification Deleted", description: "The notification has been successfully deleted." });
          fetchNotifications();
      } catch (error) {
           toast({ title: "Error", description: "Could not delete notification.", variant: "destructive" });
           console.error("Error deleting notification:", error);
      }
  };

  const handleOpenDialog = (notification: Notification | null = null) => {
    setEditingNotification(notification);
    setIsDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingNotification(null);
  }

  const handleNotificationFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const notificationData = {
          message: formData.get('message') as string,
      };

      try {
          if (editingNotification) {
              const notificationRef = doc(db, 'notifications', editingNotification.id);
              await updateDoc(notificationRef, notificationData);
              toast({ title: "Success", description: "Notification updated successfully." });
          } else {
              await addDoc(collection(db, 'notifications'), {
                  ...notificationData,
                  active: false,
              });
              toast({ title: "Success", description: "Notification added successfully." });
          }
          fetchNotifications();
          handleDialogClose();
      } catch (error) {
          console.error("Error saving notification: ", error);
          toast({ title: "Error", description: "Could not save notification.", variant: "destructive" });
      }
  }

  if (loading) {
      return (
          <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-headline">Manage Notifications</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Site Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </CardContent>
            </Card>
          </div>
      )
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline">Manage Notifications</h1>
         <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Notification
        </Button>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{editingNotification ? 'Edit Notification' : 'Add New Notification'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleNotificationFormSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">Message</Label>
                        <Textarea id="message" name="message" defaultValue={editingNotification?.message} className="col-span-3" required />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleDialogClose}>Cancel</Button>
                        <Button type="submit">Save Notification</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>


      <Card>
          <CardHeader>
              <CardTitle>All Site Notifications</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map(notification => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium max-w-lg truncate">{notification.message}</TableCell>
                      <TableCell>
                         <div className="flex items-center space-x-2">
                            <Switch
                                id={`active-switch-${notification.id}`}
                                checked={notification.active}
                                onCheckedChange={() => handleActiveToggle(notification.id, notification.active)}
                            />
                            <Label htmlFor={`active-switch-${notification.id}`}>{notification.active ? 'Yes' : 'No'}</Label>
                        </div>
                      </TableCell>
                       <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(notification)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteNotification(notification.id)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
}
