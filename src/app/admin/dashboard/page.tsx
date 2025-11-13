'use client';

import { useEffect, useState } from 'react';
import type { Route, Driver, Alert } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { getClientRoutes, getDrivers, getAlerts } from '@/lib/data-service-client';
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
      // Wait for the authentication state to be resolved first.
      return;
    }

    const fetchData = async () => {
      setDataLoading(true);
      try {
        // 1. Fetch public data that everyone can see.
        const routesPromise = getClientRoutes();
        const alertsPromise = getAlerts();
        const [routesData, alertsData] = await Promise.all([
          routesPromise.catch(() => []),
          alertsPromise.catch(() => []),
        ]);
        setRoutes(routesData);
        setAlerts(alertsData);

        // 2. Check for an authenticated user and admin claims.
        if (user) {
          const tokenResult = await user.getIdTokenResult(true); // Force refresh
          const userIsAdmin = tokenResult.claims.admin === true;
          setIsAdmin(userIsAdmin);

          if (userIsAdmin) {
            // 3. If user is an admin, fetch admin-only data.
            const driversData = await getDrivers().catch(() => []);
            setDrivers(driversData);
          } else {
            // If not an admin, ensure drivers list is empty.
            setDrivers([]);
          }
        } else {
          // If no user, ensure drivers list is empty.
          setDrivers([]);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("An error occurred during data fetching:", error);
        // Reset state in case of a critical error
        setDrivers([]);
        setIsAdmin(false);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
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

  // AuthGuard should prevent this, but as a fallback, don't render if no user.
  if (!user) {
    return null;
  }

  return (
    <DashboardClient
      routes={routes}
      alerts={alerts}
      // Pass an empty array for drivers if the user is not an admin
      drivers={isAdmin ? drivers : []}
    />
  );
}
