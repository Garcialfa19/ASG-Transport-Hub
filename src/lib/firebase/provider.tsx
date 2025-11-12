'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from './client';
import type { User } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { getApp } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = getApp();
    console.log("Firebase projectId:", app.options.projectId);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("Signed in?", !!firebaseUser, "uid:", firebaseUser?.uid);
      if (firebaseUser) {
        const { uid, email, displayName } = firebaseUser;
        setUser({ uid, email, displayName });
        const token = await firebaseUser.getIdTokenResult(true);
        console.log("Custom claims:", token.claims);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
     return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
     )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
