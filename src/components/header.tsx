
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useCart } from './cart-provider';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { MobileNav } from './mobile-nav';
import { useAuth } from './auth-provider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/offers', label: 'Offers' },
  { href: '/bulk-order', label: 'Bulk Orders' },
];

export function Header() {
  const { cart } = useCart();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [logoClicks, setLogoClicks] = useState(0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoClick = () => {
    const newClickCount = logoClicks + 1;
    setLogoClicks(newClickCount);
    if (newClickCount >= 6) {
      router.push('/admin/login');
      setLogoClicks(0); // Reset after redirect
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div onClick={handleLogoClick} className="cursor-pointer">
           <Link href="/" className="flex items-center gap-2 text-xl font-headline font-bold text-foreground hover:text-primary transition-colors">
              Namma Dream Fashion
           </Link>
        </div>
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

           {!loading && (
              user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <User className="h-6 w-6 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        Profile & Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className='hidden md:flex items-center space-x-2'>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )
           )}

          <div className="md:hidden">
            <MobileNav navLinks={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}
