'use client';

import { useMemo } from 'react';
import type { Route, Alert, Driver } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useCollection } from '@/lib/firebase/hooks/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const routesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'routes'), orderBy('nombre', 'asc'));
  }, []);

  const alertsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'alerts'), orderBy('lastUpdated', 'desc'));
  }, []);

  const driversQuery = useMemo(() => {
    if (!firestore || !user) return null; // Only fetch if user is logged in
    return query(collection(firestore, 'drivers'), orderBy('nombre', 'asc'));
  }, [user]);

  const { data: routes, loading: routesLoading } = useCollection<Route>(routesQuery);
  const { data: alerts, loading: alertsLoading } = useCollection<Alert>(alertsQuery);
  const { data: drivers, loading: driversLoading } = useCollection<Driver>(driversQuery);

  const dataLoading = routesLoading || alertsLoading || driversLoading;

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

  if (!user) {
    return null;
  }

  return (
    <DashboardClient
      routes={routes || []}
      alerts={alerts || []}
      drivers={drivers || []}
    />
  );
}
