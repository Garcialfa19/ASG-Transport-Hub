import { getRoutes, getAlerts, getDrivers } from '@/lib/actions';
import { DashboardPageClient } from './DashboardPageClient';

export default async function AdminDashboardPage() {
  // Fetching the initial data on the server ensures the page is pre-rendered with content,
  // improving load times and SEO. The client component will then take over for real-time updates.
  const initialRoutes = await getRoutes();
  const initialAlerts = await getAlerts();
  const initialDrivers = await getDrivers();

  return (
    <DashboardPageClient
      initialRoutes={initialRoutes}
      initialAlerts={initialAlerts}
      initialDrivers={initialDrivers}
    />
  );
}
