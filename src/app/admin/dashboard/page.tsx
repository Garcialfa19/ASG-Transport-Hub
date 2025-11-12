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
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [drivers, setDrivers] = useState<Driver[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        // Always try public data
        const [routesData, alertsData] = await Promise.all([
          getClientRoutes().catch(() => []),
          getAlerts().catch(() => []),
        ]);
        setRoutes(routesData);
        setAlerts(alertsData);

        // If signed in, check claim and conditionally load drivers
        if (user) {
          const token = await user.getIdTokenResult(true);
          const adminFlag = token.claims?.admin === true;
          setIsAdmin(adminFlag);

          if (adminFlag) {
            const driversData = await getDrivers().catch(() => []);
            setDrivers(driversData);
          } else {
            setDrivers([]); // not admin -> show empty drivers list
          }
        } else {
          setDrivers([]); // signed out -> no drivers
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [authLoading]);

  if (loading || authLoading || routes === null || alerts === null || drivers === null) {
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

  // AuthGuard will handle redirection if not signed in at all
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
