
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from './auth-provider';
import { Separator } from './ui/separator';

interface NavLink {
    href: string;
    label: string;
}

interface MobileNavProps {
    navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        setOpen(false);
    }
    
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetTitle className="sr-only">Namma Dream Fashion</SheetTitle>
                <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>
                <div className="flex flex-col space-y-2 pt-10 h-full">
                   <div className="flex-grow">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    'text-xl font-medium transition-colors hover:text-primary block py-3',
                                    pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                   </div>

                    <Separator />

                    <div className="py-4">
                        {!loading && (
                            user ? (
                                <div className="space-y-4">
                                     <Link
                                        href="/profile"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center text-xl font-medium transition-colors hover:text-primary text-muted-foreground"
                                    >
                                        <User className="mr-3 h-6 w-6" /> Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-xl font-medium transition-colors hover:text-primary text-muted-foreground"
                                    >
                                        <LogOut className="mr-3 h-6 w-6" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Button asChild className="w-full" size="lg" onClick={() => setOpen(false)}>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full" size="lg" onClick={() => setOpen(false)}>
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
