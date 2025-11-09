import { Facebook, Mail, Phone } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Logo />
            <p className="text-sm text-muted-foreground">Transporte de confianza en Grecia y Sarchí.</p>
          </div>
          <div className="flex flex-col items-center gap-4 text-sm">
             <div className="flex items-center gap-4">
                <a href="mailto:info@asg.cr" className="flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4" />
                  <span>info@asg.cr</span>
                </a>
                <a href="tel:+50624940000" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" />
                  <span>+506 2494 0000</span>
                </a>
             </div>
             <div>
                <Button variant="ghost" size="icon" asChild>
                    <a href="https://www.facebook.com/p/Autotransportes-Santa-Gertrudis-100063625472097/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <Facebook className="h-5 w-5" />
                    </a>
                </Button>
             </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Autotransportes Santa Gertrudis. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
