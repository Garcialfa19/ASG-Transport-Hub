import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, Rocket, Heart } from 'lucide-react';
import heroImage from './HeroImage.png';

const misionImage = PlaceHolderImages.find((img) => img.id === 'history-mision');
const visionImage = PlaceHolderImages.find((img) => img.id === 'history-vision');
const valoresImage = PlaceHolderImages.find((img) => img.id === 'history-valores');

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'Misión',
    description: 'Proveer un servicio de transporte público seguro, eficiente y amigable, conectando comunidades y facilitando el día a día de nuestros pasajeros.',
    image: misionImage,
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Visión',
    description: 'Ser la empresa líder en transporte de la región, reconocida por nuestra innovación, calidad de servicio y compromiso con el desarrollo sostenible.',
    image: visionImage,
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Valores',
    description: 'Nuestras operaciones se guían por la seguridad, la puntualidad, el respeto hacia nuestros clientes y la integridad en todas nuestras acciones.',
    image: valoresImage,
  },
];

export default function HistoriaPage() {
  return (
    <>
      <section className="relative h-[650px] bg-secondary">
        <Image
          src={heroImage}
          alt="Vintage ASG bus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Nuestra Historia</h1>
            <p className="mt-4 max-w-2xl text-lg">Más de 50 años conectando a Grecia y Sarchí</p>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Un Legado de Servicio</h2>
            <p className="mt-4 text-muted-foreground">
            Desde nuestra fundación en 1970, Autotransportes Santa Gertrudis ha sido un pilar fundamental en la comunidad. Comenzamos con una pequeña flota y un gran sueño: ofrecer un transporte confiable para los trabajadores y familias de la zona. A lo largo de las décadas, hemos crecido y modernizado nuestros servicios, siempre manteniendo nuestro compromiso con la gente a la que servimos.
            </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="overflow-hidden text-center">
              {feature.image && (
                <div className="relative h-40 w-full">
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={feature.image.imageHint}
                  />
                </div>
              )}
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
