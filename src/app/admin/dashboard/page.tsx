import { getRoutes, getAlerts, getDrivers } from '@/lib/actions';
import { DashboardPageClient } from './DashboardPageClient';

export default async function AdminDashboardPage() {
  const [routes, alerts, drivers] = await Promise.all([
    getRoutes(),
    getAlerts(),
    getDrivers(),
  ]);

  return (
    <DashboardPageClient
      initialRoutes={routes}
      initialAlerts={alerts}
      initialDrivers={drivers}
    />
  );
}
