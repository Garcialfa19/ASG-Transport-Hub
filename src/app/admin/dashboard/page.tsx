'use client';

import { useEffect, useState } from 'react';
import type { Route, Driver, Alert } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { getRoutes, getDrivers, getAlerts } from '@/lib/data-service-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [data, setData] = useState<{ routes: Route[], drivers: Driver[], alerts: Alert[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardData() {
      try {
        setLoading(true);
        const routesPromise = getRoutes();
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
    }
    getDashboardData();
  }, []);


  if (loading || !data) {
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

  return <DashboardClient routes={data.routes} drivers={data.drivers} alerts={data.alerts} />;
}