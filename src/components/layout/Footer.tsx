import { Facebook } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#16216C] text-white">
      <div className="container py-8 text-center">
        <p className="text-sm">&copy; {currentYear} Autotransportes Santa Gertrudis.</p>
        <div className="flex justify-center items-center gap-2 my-4">
            <span className="text-sm">Síguenos en:</span>
            <a href="https://www.facebook.com/p/ASG-Autotransportes-Santa-Gertrudis-Limitada-100057579364928/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-4 w-4 hover:text-primary" />
            </a>
        </div>
        <p className="text-sm">
            Contacto: <a href="mailto:info@asgcr.com" className="hover:underline">info@asgcr.com</a> | Tel: <a href="tel:+50624944231" className="hover:underline">+506 2494-4231</a>
        </p>
      </div>
    </footer>
  );
}
