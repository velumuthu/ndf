
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
          setIsAdmin(adminEmails.includes(user.email));
        } else {
            // To bootstrap, let's create a default admin role if it doesn't exist
            // In a real app, this should be handled securely.
            console.log("No admin role found. You can set one up in Firestore under roles/admin");
            setIsAdmin(false);
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
