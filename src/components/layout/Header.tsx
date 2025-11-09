'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';

const navLinks = [
  { href: '/alertas', label: 'Alertas' },
  { href: '/historia', label: 'Historia' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => (
        <Button
          key={link.href}
          variant="ghost"
          asChild
          className={cn(isMobile && 'w-full justify-start text-lg')}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
      {user && (
         <Button
            variant="ghost"
            asChild
            className={cn(isMobile && 'w-full justify-start text-lg')}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
          >
            <Link href="/admin/dashboard">Admin</Link>
          </Button>
      )}
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all',
        isScrolled
          ? 'border-border bg-background/80 backdrop-blur-sm shadow-sm'
          : 'bg-background'
      )}
    >
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
          <nav className="flex items-center space-x-2">{renderNavLinks()}</nav>
        </div>
        <div className="flex flex-1 justify-end md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4">
                <div className="mb-8 flex justify-between">
                  <Logo />
                  <SheetTrigger asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col space-y-4">{renderNavLinks(true)}</nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
