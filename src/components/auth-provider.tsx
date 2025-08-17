'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = () => {
    auth.signOut().then(() => {
        router.push('/');
    });
  };

  if (loading) {
      return (
          <div className="flex flex-col min-h-screen">
            <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                     <Skeleton className="h-6 w-48" />
                     <div className="hidden md:flex items-center space-x-8">
                         <Skeleton className="h-6 w-20" />
                         <Skeleton className="h-6 w-20" />
                         <Skeleton className="h-6 w-20" />
                     </div>
                     <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>
             <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <Skeleton className="h-[60vh] w-full" />
             </main>
          </div>
      )
  }

  return (
    <AuthContext.Provider value={{ user, loading, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
