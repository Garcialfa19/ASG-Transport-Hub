import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoutes } from "@/lib/actions";
import { RouteCard } from "./RouteCard";

export async function RoutesSection() {
  const routes = await getRoutes();
  const greciaRoutes = routes.filter((route) => route.category === 'grecia');
  const sarchiRoutes = routes.filter((route) => route.category === 'sarchi');

  return (
    <section className="container py-12 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Nuestras Rutas</h1>
        <p className="mt-2 text-lg text-muted-foreground">Encuentre el horario y la tarifa para su viaje.</p>
      </div>

      <Tabs defaultValue="grecia" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="grecia">Rutas de Grecia</TabsTrigger>
          <TabsTrigger value="sarchi">Rutas de Sarchí</TabsTrigger>
        </TabsList>

        <TabsContent value="grecia" className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {greciaRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
           {greciaRoutes.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">No hay rutas de Grecia para mostrar.</p>
          )}
        </TabsContent>

        <TabsContent value="sarchi" className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sarchiRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
          {sarchiRoutes.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">No hay rutas de Sarchí para mostrar.</p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
