
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import { Package, ShoppingBag, Tag, Users } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const adminNavLinks = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/bulk-orders', label: 'Bulk Orders', icon: ShoppingBag },
  { href: '/admin/offers', label: 'Offers', icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();

  const loading = authLoading || adminLoading;
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return (
        <div className="text-center py-16">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground mt-2">You must be logged in to view this page.</p>
            <Button asChild className="mt-4">
                <Link href="/login">Login</Link>
            </Button>
        </div>
    )
  }

  if (!isAdmin) {
       return (
        <div className="text-center py-16">
            <h1 className="text-3xl font-bold">Administrator Access Only</h1>
            <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
            <Button onClick={() => router.push('/')} className="mt-4">
                Go to Homepage
            </Button>
        </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-10">
      <aside>
        <nav className="flex flex-col space-y-2">
          {adminNavLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main>
        {children}
      </main>
    </div>
  );
}
