'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, firestore as fsClient } from './client';
import type { Firestore } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface FirebaseContextType {
  user: FirebaseUser | null;
  loading: boolean;
  firestore: Firestore | null;
}

export const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  firestore: null,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    // Set the firestore instance
    setFirestore(fsClient);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, firestore };

  return (
    <FirebaseContext.Provider value={value}>
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
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}
