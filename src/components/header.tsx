'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Shield } from 'lucide-react';
import { useCart } from './cart-provider';
import { cn } from '@/lib/utils';
import React from 'react';
import { MobileNav } from './mobile-nav';
import { useAuth } from './auth-provider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/offers', label: 'Offers' },
  { href: '/bulk-order', label: 'Bulk Orders' },
];

export function Header() {
  const { cart } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const adminLinks = user ? [{ href: '/admin', label: 'Admin' }] : [];
  const allNavLinks = [...navLinks, ...adminLinks];

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-headline font-bold text-foreground hover:text-primary transition-colors">
          Namma Dream Fashion
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-base font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
           {user && (
             <Link href="/admin" className={cn(
                'text-base font-medium transition-colors hover:text-primary',
                pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
              )}>Admin</Link>
           )}
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative group">
            <ShoppingCart className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="md:hidden">
            <MobileNav navLinks={allNavLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}
