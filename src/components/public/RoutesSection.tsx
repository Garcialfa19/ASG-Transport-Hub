'use server';

import { getRoutes } from '@/lib/actions';
import type { Route } from '@/lib/definitions';
import RoutesSectionClient from './RoutesSectionClient';

export async function RoutesSection() {
  // Server component boundary: read from Firestore using the Admin SDK so the data can be
  // statically rendered and cached at the edge. The hydrated list is forwarded to a client
  // component that manages interactivity (tabs + modal).
  const routes: Route[] = await getRoutes();

  return <RoutesSectionClient routes={routes} />;
}
