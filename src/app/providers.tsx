'use client';

import { FirebaseProvider } from '@/lib/firebase/provider';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // Single place to register any future app-wide providers. For now, Firebase handles auth and
  // Firestore context for both the admin dashboard and passenger UI.
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
