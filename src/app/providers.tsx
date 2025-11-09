'use client';

import { FirebaseProvider } from '@/lib/firebase/provider';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
