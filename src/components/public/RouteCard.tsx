'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Tag, Calendar } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScheduleModal } from './ScheduleModal';
import type { Route } from '@/lib/definitions';

interface RouteCardProps {
  route: Route;
}

export function RouteCard({ route }: RouteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return PlaceHolderImages.find(p => p.id === 'route-grecia-centro')?.imageUrl || '/default-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return imagePath;
    const placeholder = PlaceHolderImages.find(p => p.id === imagePath);
    return placeholder ? placeholder.imageUrl : imagePath;
  };
  
  const cardImage = getImageUrl(route.imagenTarjetaUrl);
  // Use a fallback placeholder for the schedule image if not provided
  const scheduleImage = getImageUrl(route.imagenHorarioUrl || 'schedule-placeholder');

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Image
            src={cardImage}
            alt={route.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{route.nombre}</CardTitle>
          <p className="text-sm text-muted-foreground">{route.especificacion}</p>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Duración: {route.duracionMin} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Tarifa: ₡{route.tarifaCRC.toLocaleString('es-CR')}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => setIsModalOpen(true)} 
            disabled={!route.imagenHorarioUrl}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Ver Horario
          </Button>
        </CardFooter>
      </Card>
      {route.imagenHorarioUrl && (
        <ScheduleModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          imageUrl={scheduleImage}
          routeName={route.nombre}
        />
      )}
    </>
  );
}
