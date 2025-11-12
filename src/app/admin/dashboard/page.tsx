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
    if (authLoading) return;
    
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        // public reads
        const [r, a] = await Promise.all([
          getClientRoutes().catch(() => []),
          getAlerts().catch(() => []),
        ]);
        setRoutes(r);
        setAlerts(a);

        if (user) {
          const token = await user.getIdTokenResult(true);
          const isAdmin = token.claims?.admin === true;
          if (isAdmin) {
            const d = await getDrivers().catch(() => []);
            setDrivers(d);
          } else {
            setDrivers([]); // hide “drivers” for non-admin
          }
        } else {
          setDrivers([]);
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [authLoading]);

  if (loading || authLoading) {
     return (
      <div className="container py-8">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-3 gap-1 h-10 mb-6">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!user) {
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
