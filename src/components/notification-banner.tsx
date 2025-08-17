
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { Megaphone } from 'lucide-react';

export function NotificationBanner() {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('active', '==', true),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setNotification(querySnapshot.docs[0].data() as Notification);
        }
      } catch (error) {
        console.error('Error fetching active notification:', error);
      }
    };

    fetchNotification();
  }, []);

  if (!notification) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-10 overflow-hidden">
          <Megaphone className="h-5 w-5 mr-3 flex-shrink-0" />
          <div className="w-full overflow-hidden">
             <p className="animate-marquee whitespace-nowrap">
                {notification.message}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add keyframes to tailwind.config.ts if they don't exist
// keyframes: {
//   marquee: {
//     '0%': { transform: 'translateX(100%)' },
//     '100%': { transform: 'translateX(-100%)' },
//   },
// },
// animation: {
//   marquee: 'marquee 15s linear infinite',
// },
