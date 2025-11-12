
import { getRoutes } from '@/lib/data-service-client';
import { RouteCard } from './RouteCard';
import type { Route } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function RoutesSection() {
  const allRoutes: Route[] = await getRoutes();

  const greciaRoutes = allRoutes.filter((route) => route.category === 'grecia');
  const sarchiRoutes = allRoutes.filter((route) => route.category === 'sarchi');

  return (
    <section className="py-12 md:py-16 lg:py-20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {greciaRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
             {greciaRoutes.length === 0 && (
                <p className="text-center text-muted-foreground mt-12">No hay rutas de Grecia para mostrar.</p>
             )}
          </TabsContent>
          <TabsContent value="sarchi" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sarchiRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
            {sarchiRoutes.length === 0 && (
                <p className="text-center text-muted-foreground mt-12">No hay rutas de Sarchí para mostrar.</p>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
