'use client';

import { useEffect, useState } from 'react';
import type { Route, Alert, Driver } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { getClientRoutes, getAlerts, getDrivers } from '@/lib/data-service-client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchData = async () => {
      setDataLoading(true);
      if (!user) {
        setDataLoading(false);
        return;
      }
      
      try {
        const routesPromise = getClientRoutes();
        const alertsPromise = getAlerts();
        const driversPromise = getDrivers();

        const [routesData, alertsData, driversData] = await Promise.all([
          routesPromise,
          alertsPromise,
          driversPromise,
        ]);
        
        setRoutes(routesData);
        setAlerts(alertsData);
        setDrivers(driversData);
      } catch (error) {
        console.error("An error occurred during data fetching:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  // Show a loading skeleton while auth is resolving or data is being fetched.
  if (authLoading || (dataLoading && user)) {
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

  // If there's no user, the AuthGuard will redirect, so we don't need to render anything here.
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
