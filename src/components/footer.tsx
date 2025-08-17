
'use client';

import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-background border-t mt-24">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-headline font-bold">Namma Dream Fashion</h3>
            <p className="text-sm text-muted-foreground mt-2">Style Redefined.</p>
          </div>
          <div>
            <h4 className="font-semibold">Shop</h4>
            <ul className="space-y-2 mt-4 text-muted-foreground">
              <li><Link href="/shop" className="hover:text-primary">All</Link></li>
              <li><Link href="/shop" className="hover:text-primary">Dresses</Link></li>
              <li><Link href="/shop" className="hover:text-primary">Accessories</Link></li>
              <li><Link href="/shop" className="hover:text-primary">Combos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 mt-4 text-muted-foreground">
              <li><Link href="/bulk-order" className="hover:text-primary">Bulk Orders</Link></li>
              <li><Link href="/contact-stylist" className="hover:text-primary">Contact a Stylist</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
           <p>&copy; {new Date().getFullYear()} Namma Dream Fashion. All rights reserved.</p>
           <p className="mt-2">Designed and Developed by btechnologies</p>
        </div>
      </div>
    </footer>
  );
}
