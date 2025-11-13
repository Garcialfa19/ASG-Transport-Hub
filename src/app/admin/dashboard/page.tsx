'use client';

import { useMemo } from 'react';
import type { Route, Alert, Driver } from '@/lib/definitions';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useCollection } from '@/lib/firebase/hooks/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '@/lib/firebase/provider';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { firestore } = useFirebase();

  // I memoize the queries so Firestore doesn't create a new listener on every render.
  const routesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'routes'), orderBy('nombre', 'asc'));
  }, [firestore]);

  // Alerts are sorted by `lastUpdated` so the newest notice floats to the top of the list I render.
  const alertsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'alerts'), orderBy('lastUpdated', 'desc'));
  }, [firestore]);

  const driversQuery = useMemo(() => {
    if (!firestore || !user) return null; // I only fetch drivers when an admin is logged in.
    return query(collection(firestore, 'drivers'), orderBy('nombre', 'asc'));
  }, [firestore, user]);

  // Each call wires up a realtime listener. I like the symmetry between server actions (mutations)
  // and these hooks because the UI updates instantly after a write.
  const { data: routes, loading: routesLoading } = useCollection<Route>(routesQuery);
  const { data: alerts, loading: alertsLoading } = useCollection<Alert>(alertsQuery);
  const { data: drivers, loading: driversLoading } = useCollection<Driver>(driversQuery);

  const dataLoading = routesLoading || alertsLoading || driversLoading;

  // While the auth state or the Firestore listeners are still resolving I keep the skeletons
  // on screen so the layout doesn't jump around.
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
    // The AuthGuard handles redirects, but I keep this guard to make the component resilient
    // when I reuse it in tests or storybooks.
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
