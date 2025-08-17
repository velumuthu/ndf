
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const adminDocRef = doc(db, 'roles', 'admin');
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          const adminEmails = adminData.emails || [];
          setIsAdmin(adminEmails.includes(user.email!));
        } else {
            // To bootstrap, let's create a default admin role if it doesn't exist
            console.log("No admin role found. Creating a default admin role with 'admin@example.com'.");
            await setDoc(adminDocRef, { emails: ['admin@example.com'] });
            // Check if the current user is the default admin
            setIsAdmin(user.email === 'admin@example.com');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
        checkAdminStatus();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: authLoading || loading };
}
