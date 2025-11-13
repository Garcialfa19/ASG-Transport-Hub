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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchDataAndClaims = async () => {
      setDataLoading(true);
      try {
        // Public data can be fetched immediately.
        const routesPromise = getClientRoutes();
        const alertsPromise = getAlerts();
        
        let userIsAdmin = false;
        let driversPromise: Promise<Driver[]> = Promise.resolve([]);

        if (user) {
          try {
            const tokenResult = await user.getIdTokenResult(true); // Force refresh
            userIsAdmin = tokenResult.claims.admin === true;
            if (userIsAdmin) {
              // Only fetch drivers if the user is an admin
              driversPromise = getDrivers();
            }
          } catch (tokenError) {
             console.error("Error fetching user token or drivers:", tokenError);
             userIsAdmin = false;
          }
        }
        setIsAdmin(userIsAdmin);

        // Await all data fetches concurrently
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
        setIsAdmin(false); // Ensure isAdmin is false on error
      } finally {
        setDataLoading(false);
      }
    };

    fetchDataAndClaims();
  }, [user, authLoading]);

  // Show a loading skeleton while auth is resolving or data is being fetched.
  if (authLoading || dataLoading) {
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

  return (
    <DashboardClient
      routes={routes}
      alerts={alerts}
      drivers={drivers}
      isAdmin={isAdmin}
    />
  );
}
