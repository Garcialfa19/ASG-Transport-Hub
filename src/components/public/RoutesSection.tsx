'use server';

import { getRoutes } from '@/lib/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RouteCard from './RouteCard';
import type { Route } from '@/lib/definitions';

export async function RoutesSection() {
  const routes: Route[] = await getRoutes();

  const greciaRoutes = routes.filter((route) => route.category === 'grecia');
  const sarchiRoutes = routes.filter((route) => route.category === 'sarchi');

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Nuestras Rutas</h2>
          <p className="mt-2 text-lg text-muted-foreground">Explore los destinos que conectamos.</p>
        </div>

        <Tabs defaultValue="grecia" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="grecia">Rutas de Grecia</TabsTrigger>
            <TabsTrigger value="sarchi">Rutas de Sarchí</TabsTrigger>
          </TabsList>
          <TabsContent value="grecia" className="mt-8">
            {greciaRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {greciaRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    nombre={route.nombre}
                    duracionMin={route.duracionMin}
                    costo={route.tarifaCRC}
                    imagenUrl={route.imagenTarjetaUrl}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground mt-12">No hay rutas de Grecia para mostrar.</p>
            )}
          </TabsContent>
          <TabsContent value="sarchi" className="mt-8">
             {sarchiRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sarchiRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    nombre={route.nombre}
                    duracionMin={route.duracionMin}
                    costo={route.tarifaCRC}
                    imagenUrl={route.imagenTarjetaUrl}
                  />
                ))}
              </div>
            ) : (
               <p className="text-center text-muted-foreground mt-12">No hay rutas de Sarchí para mostrar.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}