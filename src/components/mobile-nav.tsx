'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface NavLink {
    href: string;
    label: string;
}

interface MobileNavProps {
    navLinks: NavLink[];
    categories: string[];
}

export function MobileNav({ navLinks, categories }: MobileNavProps) {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
             <Button variant="ghost" size="icon" disabled>
                <Menu className="h-6 w-6" />
            </Button>
        );
    }
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetTitle className="sr-only">Namma Dream Fashion</SheetTitle>
                <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>
                <div className="flex flex-col space-y-2 pt-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-xl font-medium transition-colors hover:text-primary py-3',
                                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="shop" className="border-b-0">
                            <AccordionTrigger className={cn(
                                'text-xl font-medium transition-colors hover:text-primary hover:no-underline py-3',
                                pathname.startsWith('/shop') ? 'text-primary' : 'text-muted-foreground'
                            )}>
                                Shop
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col space-y-3 pl-4">
                                    {categories.map((category) => (
                                        <Link key={category} href="/shop" className="text-lg text-muted-foreground hover:text-primary">
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </SheetContent>
        </Sheet>
    );
}
