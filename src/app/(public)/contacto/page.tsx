import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

const mapImage = PlaceHolderImages.find((img) => img.id === 'contact-map');

const contactDetails = [
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: 'Teléfono',
    value: '+506 2494 0000',
    href: 'tel:+50624940000',
  },
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: 'Correo Electrónico',
    value: 'info@asg.cr',
    href: 'mailto:info@asg.cr',
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: 'Dirección',
    value: 'Grecia, Alajuela, Costa Rica',
  },
];

export default function ContactoPage() {
  return (
    <>
      <div className="container py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contáctenos</h1>
          <p className="mt-2 text-lg text-muted-foreground">Estamos aquí para ayudarle. Encuentre cómo comunicarse con nosotros.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactDetails.map((detail) => (
            <Card key={detail.title}>
              <CardHeader className="flex flex-col items-center text-center">
                {detail.icon}
                <CardTitle className="mt-2">{detail.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {detail.href ? (
                  <a href={detail.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {detail.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{detail.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
            <h2 className="text-2xl font-bold">Síganos en Redes Sociales</h2>
            <div className="mt-4">
                 <Button asChild>
                    <a href="https://www.facebook.com/p/Autotransportes-Santa-Gertrudis-100063625472097/" target="_blank" rel="noopener noreferrer">
                        <Facebook className="mr-2 h-4 w-4" /> Facebook
                    </a>
                </Button>
            </div>
        </div>
      </div>
      
      {mapImage && (
        <section className="relative h-96 w-full mt-16">
          <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            fill
            className="object-cover"
            data-ai-hint={mapImage.imageHint}
          />
          <div className="absolute inset-0 bg-black/30" />
        </section>
      )}
    </>
  );
}
