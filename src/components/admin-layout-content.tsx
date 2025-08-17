
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { NotificationBanner } from './notification-banner';
import { cn } from '@/lib/utils';

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NotificationBanner />
      <Header />
      <main className={cn("flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up")}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
