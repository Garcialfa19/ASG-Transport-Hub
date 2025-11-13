import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DashboardPageClient } from './DashboardPageClient';
import { getAlerts, getDrivers, getRoutes } from '@/lib/actions';
import { adminAuth } from '@/lib/firebase/admin';

async function requireAdminSession(): Promise<boolean> {
  const sessionCookie = cookies().get('adminSession')?.value;
  if (!sessionCookie) {
    return false;
  }

  try {
    const token = await adminAuth().verifyIdToken(sessionCookie, true);
    return token.admin === true;
  } catch (error) {
    console.error('Failed to verify admin session', error);
    return false;
  }
}

export default async function AdminDashboardPage() {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) {
    redirect('/admin');
  }

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
