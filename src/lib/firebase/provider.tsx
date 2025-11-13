'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, firestore as fsClient } from './client';
import type { Firestore } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface FirebaseContextType {
  user: FirebaseUser | null;
  loading: boolean;           // tracks only auth loading
  firestore: Firestore;       // available immediately
}

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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, firestore }}>
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
  if (ctx === undefined) throw new Error('useFirebase must be used within a FirebaseProvider');
  return ctx;
};
