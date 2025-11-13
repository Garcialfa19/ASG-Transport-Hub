'use client';

import { useEffect, useState } from 'react';
import type { Route, Alert } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { getClientRoutes, getAlerts } from '@/lib/data-service-client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // We need the user object to exist before we do anything.
    if (authLoading) {
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
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("An error occurred during data fetching:", error);
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

  return (
    <DashboardClient
      routes={routes}
      alerts={alerts}
      isAdmin={isAdmin}
    />
  );
}
