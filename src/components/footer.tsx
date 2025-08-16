import React from 'react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Atelier Lumière. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
