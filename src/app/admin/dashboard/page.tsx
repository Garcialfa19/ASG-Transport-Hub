'use client';

import { useEffect, useState } from 'react';
import type { Route, Driver, Alert } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { getClientRoutes, getDrivers, getAlerts } from '@/lib/data-service-client';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We still want to wait for the initial auth state to be resolved by useAuth
    if (authLoading) return;
    
    // The onAuthStateChanged listener is the most reliable way to get the user object
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        // Public reads can happen regardless of auth state
        const [r, a] = await Promise.all([
          getClientRoutes().catch(() => []),
          getAlerts().catch(() => []),
        ]);
        setRoutes(r);
        setAlerts(a);

        if (user) {
          // *** THE KEY FIX ***
          // Forcibly refresh the token to get the latest custom claims.
          const token = await user.getIdTokenResult(true);
          const isAdmin = token.claims?.admin === true;

          if (isAdmin) {
            // Only fetch drivers if the user is an admin
            const d = await getDrivers().catch(() => []);
            setDrivers(d);
          } else {
            // If not an admin, set drivers to an empty array to avoid errors
            setDrivers([]);
          }
        } else {
          // Not signed in, no drivers to show
          setDrivers([]);
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
        // Ensure loading is always stopped
        setDrivers([]);
      }
      finally {
        setLoading(false);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsub();
  }, [authLoading]); // Re-run effect if auth loading state changes

  if (loading || authLoading) {
     return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1 h-10 mb-6">
              <Skeleton className="h-full w-full" />
              <Skeleton className="h-full w-full" />
              <Skeleton className="h-full w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  
  if (!user) {
    // AuthGuard should handle this, but as a fallback, don't render the client
    return null;
  }

  return (
    <DashboardClient
      routes={routes}
      alerts={alerts}
      drivers={drivers}
    />
  );
}
