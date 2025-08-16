'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from './cart-provider';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/bulk-order', label: 'Bulk Orders' },
];

export function Header() {
  const { cart } = useCart();
  const pathname = usePathname();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-headline font-bold text-foreground hover:text-primary transition-colors">
          NDF
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Namma Dream Fashion</SheetTitle>
                <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>
                <div className="flex flex-col space-y-6 pt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-xl font-medium transition-colors hover:text-primary',
                        pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
