'use client';

import { useEffect, useState } from 'react';
import type { Route, Driver, Alert } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { getClientRoutes, getDrivers, getAlerts } from '@/lib/data-service-client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<{ routes: Route[], drivers: Driver[], alerts: Alert[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardData() {
      // Only fetch data if the user is authenticated
      if (!authLoading && user) {
        try {
          setLoading(true);
          const routesPromise = getClientRoutes();
          const driversPromise = getDrivers();
          const alertsPromise = getAlerts();

          const [routes, drivers, alerts] = await Promise.all([
            routesPromise,
            driversPromise,
            alertsPromise,
          ]);
          
          setData({ routes, drivers, alerts });
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          setData({ routes: [], drivers: [], alerts: [] });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        // If not authenticated, stop loading but don't fetch
        setLoading(false);
      }
    }
    getDashboardData();
  }, [user, authLoading]);


  if (authLoading || (loading && user)) {
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
      // AuthGuard should handle this, but as a fallback.
      return null;
  }

  // data will be non-null here because we've waited for loading to finish
  return <DashboardClient routes={data!.routes} drivers={data!.drivers} alerts={data!.alerts} />;
}
