import { adminDb } from '@/lib/firebase/admin';
import type { Route } from '@/lib/definitions';
import { RouteCard } from '@/components/public/RouteCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

async function getRoutes(): Promise<Route[]> {
  try {
    const snapshot = await adminDb.collection('routes').orderBy('nombre', 'asc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Route));
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
}

export async function RoutesSection() {
  const routes = await getRoutes();
  const greciaRoutes = routes.filter(r => r.category === 'grecia');
  const sarchiRoutes = routes.filter(r => r.category === 'sarchi');

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Nuestras Rutas</h1>
        <p className="mt-2 text-lg text-muted-foreground">Encuentre el horario y la información de su ruta de interés.</p>
      </div>
      
      {routes.length > 0 ? (
        <Tabs defaultValue="grecia" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="grecia">Rutas de Grecia</TabsTrigger>
            <TabsTrigger value="sarchi">Rutas de Sarchí</TabsTrigger>
          </TabsList>
          <TabsContent value="grecia" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {greciaRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
            {greciaRoutes.length === 0 && (
                 <p className="text-center text-muted-foreground mt-10">No hay rutas de Grecia para mostrar.</p>
            )}
          </TabsContent>
          <TabsContent value="sarchi" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sarchiRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
             {sarchiRoutes.length === 0 && (
                <p className="text-center text-muted-foreground mt-10">No hay rutas de Sarchí para mostrar.</p>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 max-w-lg mx-auto">
            <CardContent className="flex flex-col items-center text-center gap-4">
              <Info className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No se encontraron rutas.</p>
              <p className="text-muted-foreground">Por favor, inténtelo de nuevo más tarde.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
