
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/components/cart-provider';
import { AuthProvider } from '@/components/auth-provider';
import { AdminLayoutContent } from '@/components/admin-layout-content';


export const metadata: Metadata = {
  title: 'Namma Dream Fashion',
  description: 'An elegant e-commerce website for a fashion boutique.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased h-full">
        <AuthProvider>
          <CartProvider>
            <AdminLayoutContent>
              {children}
            </AdminLayoutContent>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
