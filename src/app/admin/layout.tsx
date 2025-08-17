
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import { Package, ShoppingBag, Tag, LayoutDashboard, MessageSquareHeart, ClipboardList } from 'lucide-react';
import { Shield } from 'lucide-react';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/bulk-orders', label: 'Bulk Orders', icon: ShoppingBag },
  { href: '/admin/offers', label: 'Offers', icon: Tag },
  { href: '/admin/contact-stylist', label: 'Stylist Inquiries', icon: MessageSquareHeart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-10">
      <aside>
        <nav className="flex flex-col space-y-2">
           <Link href="/" className="text-xl font-headline font-bold text-foreground hover:text-primary transition-colors mb-6 flex items-center gap-2">
              <Shield /> Admin Panel
            </Link>
          {adminNavLinks.map(link => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors',
                  isActive
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
