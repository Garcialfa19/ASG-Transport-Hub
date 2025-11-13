'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Bus, User, Bell } from 'lucide-react';
import type { Route, Alert, Driver } from '@/lib/definitions';
import { RouteManager } from './RouteManager';
import { DriverManager } from './DriverManager';
import { AlertManager } from './AlertManager';
import { Logo } from '../shared/Logo';

interface DashboardClientProps {
  routes: Route[];
  alerts: Alert[];
  drivers: Driver[];
}

// I keep this component client-side so I can tap into the Firebase Auth state and mutate UI state
// without worrying about server rendering.
export function DashboardClient({ routes: initialRoutes, alerts: initialAlerts, drivers: initialDrivers }: DashboardClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  // I pass the initial Firestore snapshot down to each manager so they can hydrate their local
  // state before the realtime listeners kick in.

  // Centralized logout handler so every tab shares the same toast/redirect logic.
  const handleLogout = async () => {
    try {
      await signOut(auth);
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      document.cookie = `adminSession=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
      toast({ title: 'Sesión cerrada', description: 'Ha cerrado sesión correctamente.' });
      router.push('/admin');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cerrar la sesión.' });
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* I keep the header sticky so admins can always reach the logout button. */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
            <Logo />
            <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
            </Button>
        </div>
      </header>
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        {/* Tabs keep the dashboard sections isolated while sharing the same layout shell. */}
        <Tabs defaultValue="routes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="routes"><Bus className="mr-2 h-4 w-4" /> Rutas</TabsTrigger>
            <TabsTrigger value="drivers"><User className="mr-2 h-4 w-4" /> Choferes</TabsTrigger>
            <TabsTrigger value="alerts"><Bell className="mr-2 h-4 w-4" /> Alertas</TabsTrigger>
          </TabsList>
          <TabsContent value="routes" className="mt-6">
            <RouteManager initialRoutes={initialRoutes} />
          </TabsContent>
          <TabsContent value="drivers" className="mt-6">
            <DriverManager initialDrivers={initialDrivers} routes={initialRoutes} />
          </TabsContent>
          <TabsContent value="alerts" className="mt-6">
            <AlertManager initialAlerts={initialAlerts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
