import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRoutes, getAlerts, getDrivers } from '@/lib/actions';
import { adminAuth } from '@/lib/firebase/admin';
import { DashboardPageClient } from './DashboardPageClient';

async function requireAdminSession() {
  const sessionCookie = cookies().get('adminSession')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth().verifyIdToken(sessionCookie);
    if (!decoded.admin) {
      return null;
    }
    return decoded;
  } catch (error) {
    console.error('Failed to verify admin session', error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  if (!(await requireAdminSession())) {
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
