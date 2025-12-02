'use server';

import { getRoutes } from '@/lib/actions';
import type { Route } from '@/lib/definitions';
import RoutesSectionClient from './RoutesSectionClient';

export async function RoutesSection() {
  const routes: Route[] = await getRoutes();

  return <RoutesSectionClient routes={routes} />;
}
