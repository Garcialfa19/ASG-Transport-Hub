
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, Tag, Calendar, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Route } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface RouteCardProps {
  route: Route;
}

export function RouteCard({ route }: RouteCardProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  const getImageUrl = (imagePath?: string) => {
    const defaultImage = PlaceHolderImages.find(p => p.id === 'route-grecia-centro')?.imageUrl || '/default-image.png';
    if (!imagePath) return defaultImage;
    if (imagePath.startsWith('https://')) return imagePath;
    return PlaceHolderImages.find(p => p.id === imagePath)?.imageUrl || defaultImage;
  }

  const cardImage = getImageUrl(route.imagenTarjetaUrl);
  const scheduleImage = getImageUrl(route.imagenHorarioUrl);
  const defaultScheduleImage = PlaceHolderImages.find(p => p.id === 'schedule-placeholder')?.imageUrl;


  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={cardImage}
            alt={`Imagen de la ruta ${route.nombre}`}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Badge variant="secondary" className="mb-2">{route.category}</Badge>
        <CardTitle className="text-xl mb-1">{route.nombre}</CardTitle>
        <p className="text-sm text-muted-foreground min-h-[40px]">{route.especificacion}</p>
        
        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Duración: {route.duracionMin} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Tarifa: ₡{route.tarifaCRC.toLocaleString('es-CR')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" /> Ver Horario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Horario: {route.nombre}</DialogTitle>
            </DialogHeader>
            <div className="relative mt-4 aspect-[4/3] w-full max-h-[70vh] overflow-hidden rounded-md bg-secondary">
              {scheduleImage ? (
                <Image
                  src={scheduleImage}
                  alt={`Horario de la ruta ${route.nombre}`}
                  fill
                  className="object-contain"
                />
              ): defaultScheduleImage ? (
                 <Image
                  src={defaultScheduleImage}
                  alt="Horario no disponible"
                  fill
                  className="object-contain p-8 opacity-50"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Horario no disponible</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
