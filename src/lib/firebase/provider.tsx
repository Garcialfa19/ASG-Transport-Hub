'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from './client';
import { Skeleton } from '@/components/ui/skeleton';
import { getApp } from 'firebase/app';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = getApp();
    console.log("Firebase projectId:", app.options.projectId);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("Signed in?", !!firebaseUser, "uid:", firebaseUser?.uid);
      setUser(firebaseUser); // Store the full FirebaseUser object
      if (firebaseUser) {
        const token = await firebaseUser.getIdTokenResult(true);
        console.log("Custom claims:", token.claims);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
