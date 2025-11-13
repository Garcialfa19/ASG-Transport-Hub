'use client';

import { useFirebase } from '@/lib/firebase/provider';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

// Tiny wrapper that keeps my auth hook portable across components and tests.
export const useAuth = (): AuthContextType => {
  const { user, loading } = useFirebase();
  return { user, loading };
};
