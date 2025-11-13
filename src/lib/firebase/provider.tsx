'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  onIdTokenChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, firestore as fsClient } from './client';
import type { Firestore } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface FirebaseContextType {
  user: FirebaseUser | null;
  loading: boolean;           // tracks only auth loading
  firestore: Firestore;       // available immediately
}

// I expose the raw Firebase bits through context so any client component can subscribe.
export const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  firestore: fsClient,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Firestore is ready immediately; do NOT wait for auth.
  const firestore = fsClient;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    const unsubscribeToken = onIdTokenChanged(auth, async (u) => {
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      if (!u) {
        document.cookie = `adminSession=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
        return;
      }

      try {
        const tokenResult = await u.getIdTokenResult();
        const expiration = tokenResult.expirationTime
          ? new Date(tokenResult.expirationTime).getTime()
          : undefined;
        const maxAge = expiration
          ? Math.max(0, Math.floor((expiration - Date.now()) / 1000))
          : 60 * 60;

        document.cookie = `adminSession=${tokenResult.token}; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
      } catch (error) {
        console.error('Failed to refresh admin session cookie', error);
        document.cookie = `adminSession=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
      }
    });
    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);


  const contextValue = { user, loading, firestore } as const;

  return (
    <FirebaseContext.Provider value={contextValue}>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const ctx = useContext(FirebaseContext);
  // Guarding here helps me catch cases where I forget to wrap a tree in FirebaseProvider.
  if (ctx === undefined) throw new Error('useFirebase must be used within a FirebaseProvider');
  return ctx;
};
