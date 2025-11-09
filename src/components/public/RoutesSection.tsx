'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Info, ChevronsRight } from 'lucide-react';
import type { Route } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { getRoutes } from '@/lib/data-service-client';

export function RoutesSection() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const fetchedRoutes = await getRoutes();
        setRoutes(fetchedRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }, []);

  const greciaRoutes = routes.filter((route) => route.category === 'grecia');
  const sarchiRoutes = routes.filter((route) => route.category === 'sarchi');

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath)
      return (
        PlaceHolderImages.find((p) => p.id === 'route-grecia-centro')
          ?.imageUrl || '/default-image.png'
      );
    if (imagePath.startsWith('http') || imagePath.startsWith('/uploads')) {
      return imagePath;
    }
    return (
      PlaceHolderImages.find((p) => p.id === imagePath)?.imageUrl || imagePath
    );
  };

  const getScheduleImageUrl = (route: Route) => {
    if (route.imagenHorarioUrl) {
      return getImageUrl(route.imagenHorarioUrl);
    }
    return (
      PlaceHolderImages.find((p) => p.id === 'schedule-placeholder')
        ?.imageUrl || '/default-schedule.png'
    );
  };

  const renderRouteCard = (route: Route) => (
    <Card key={route.id} className="flex flex-col overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={getImageUrl(route.imagenTarjetaUrl)}
          alt={`Imagen de la ruta ${route.nombre}`}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{route.nombre}</CardTitle>
        <CardDescription className="line-clamp-2">
          {route.especificacion}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>Duración: {route.duracionMin} min</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-bold text-primary">
          ₡{route.tarifaCRC.toLocaleString('es-CR')}
        </span>
        <Button
          onClick={() => setSelectedRoute(route)}
        >
          Ver Horario
        </Button>
      </CardFooter>
    </Card>
  );
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
         <Card key={i} className="flex flex-col overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-5 w-1/2" />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Skeleton className="h-7 w-1/4" />
                <Skeleton className="h-10 w-1/3" />
            </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <section className="container py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Nuestras Rutas
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Conectamos las comunidades de Grecia y Sarchí con un servicio
          confiable y puntual. Encuentre su ruta y consulte los horarios.
        </p>
      </section>

      <section className="container pb-16">
        <Tabs defaultValue="grecia" className="w-full">
          <TabsList className="mx-auto grid max-w-md grid-cols-2">
            <TabsTrigger value="grecia">Rutas de Grecia</TabsTrigger>
            <TabsTrigger value="sarchi">Rutas de Sarchí</TabsTrigger>
          </TabsList>
          <TabsContent value="grecia" className="mt-8">
            {loading ? renderSkeleton() : (
              greciaRoutes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {greciaRoutes.map(renderRouteCard)}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No se encontraron rutas para Grecia.</p>
              )
            )}
          </TabsContent>
          <TabsContent value="sarchi" className="mt-8">
             {loading ? renderSkeleton() : (
              sarchiRoutes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sarchiRoutes.map(renderRouteCard)}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No se encontraron rutas para Sarchí.</p>
              )
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Dialog open={!!selectedRoute} onOpenChange={(isOpen) => !isOpen && setSelectedRoute(null)}>
        <DialogContent className="max-w-2xl p-0">
          {selectedRoute && (
            <>
            <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl">{selectedRoute.nombre}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedRoute.especificacion}</p>
            </DialogHeader>
            <div className="relative h-[500px] w-full">
                <Image
                src={getScheduleImageUrl(selectedRoute)}
                alt={`Horario para ${selectedRoute.nombre}`}
                fill
                className="object-contain"
                />
            </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
