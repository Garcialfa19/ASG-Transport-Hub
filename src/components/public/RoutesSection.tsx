import { getRoutes } from "@/lib/actions";
import { RouteCard } from "./RouteCard";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Bus } from "lucide-react";

export const revalidate = 60; // Revalidate every 60 seconds

export async function RoutesSection() {
  const routes = await getRoutes();

  if (!routes || routes.length === 0) {
    return (
      <div className="container py-12 md:py-16">
        <div className="max-w-xl mx-auto">
            <Alert>
              <Bus className="h-4 w-4" />
              <AlertTitle>No hay rutas disponibles</AlertTitle>
              <AlertDescription>
                Por favor, intente de nuevo más tarde o contacte al soporte.
              </AlertDescription>
            </Alert>
        </div>
      </div>
    );
  }
  
  const greciaRoutes = routes.filter(route => route.category === 'grecia');
  const sarchiRoutes = routes.filter(route => route.category === 'sarchi');

  return (
    <div className="container py-12 md:py-16">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Nuestras Rutas</h1>
            <p className="mt-2 text-lg text-muted-foreground">Explore los destinos que conectamos para usted.</p>
        </div>
        
        {greciaRoutes.length > 0 && (
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Rutas de Grecia</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {greciaRoutes.map(route => (
                        <RouteCard key={route.id} route={route} />
                    ))}
                </div>
            </div>
        )}

        {sarchiRoutes.length > 0 && (
            <div>
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Rutas de Sarchí</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sarchiRoutes.map(route => (
                        <RouteCard key={route.id} route={route} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}