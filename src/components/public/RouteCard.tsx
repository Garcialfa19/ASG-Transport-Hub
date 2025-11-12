'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Route } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface RouteCardProps {
  route: Route;
}

export function RouteCard({ route }: RouteCardProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const defaultImage = PlaceHolderImages.find(p => p.id === 'route-grecia-centro');
  const schedulePlaceholder = PlaceHolderImages.find(p => p.id === 'schedule-placeholder');

  const cardImageUrl = route.imagenTarjetaUrl || defaultImage?.imageUrl || '';
  const scheduleImageUrl = route.imagenHorarioUrl || schedulePlaceholder?.imageUrl || '';

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Image
            src={cardImageUrl}
            alt={`Imagen de la ruta ${route.nombre}`}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle>{route.nombre}</CardTitle>
          {route.especificacion && (
            <p className="text-sm text-muted-foreground">{route.especificacion}</p>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="capitalize">{route.category}</Badge>
            <span>•</span>
            <Clock className="h-4 w-4" />
            <span>{route.duracionMin} min</span>
          </div>
          <p className="mt-4 text-2xl font-bold">
            ₡{route.tarifaCRC.toLocaleString('es-CR')}
          </p>
        </CardContent>
        <CardFooter>
            <Button
              className="w-full"
              onClick={() => setIsScheduleOpen(true)}
              disabled={!route.imagenHorarioUrl}
            >
              <Info className="mr-2 h-4 w-4" />
              Ver Horario
            </Button>
        </CardFooter>
      </Card>

      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Horario: {route.nombre}</DialogTitle>
          </DialogHeader>
          <div className="relative mt-4 h-[70vh] w-full">
            <Image
              src={scheduleImageUrl}
              alt={`Horario para ${route.nombre}`}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
