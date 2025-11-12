'use client';

import Image from 'next/image';
import { Clock, Tag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Route } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '../ui/badge';

interface RouteCardProps {
  route: Route;
}

export function RouteCard({ route }: RouteCardProps) {
  const getImageUrl = (imagePath?: string) => {
    const defaultImage = PlaceHolderImages.find(p => p.id === 'route-grecia-centro')?.imageUrl || '/default-image.png';
    return imagePath || defaultImage;
  }
  
  const getScheduleImageUrl = (imagePath?: string) => {
    const defaultImage = PlaceHolderImages.find(p => p.id === 'schedule-placeholder')?.imageUrl || '/default-schedule.png';
    return imagePath || defaultImage;
  }

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-40 w-full">
        <Image
          src={getImageUrl(route.imagenTarjetaUrl)}
          alt={route.nombre}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{route.nombre}</CardTitle>
        {route.especificacion && <p className="text-sm text-muted-foreground">{route.especificacion}</p>}
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Ver Horario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Horario de: {route.nombre}</DialogTitle>
              <DialogDescription>
                Este es el horario programado para esta ruta. Los horarios pueden estar sujetos a cambios.
              </DialogDescription>
            </DialogHeader>
            <div className="relative mt-4" style={{ paddingBottom: '70.75%' }}>
              <Image
                src={getScheduleImageUrl(route.imagenHorarioUrl)}
                alt={`Horario de ${route.nombre}`}
                fill
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
