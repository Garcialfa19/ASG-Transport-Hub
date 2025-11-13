
'use client';

import { useEffect, useState, useRef } from 'react';
import { onSnapshot, query, Query, CollectionReference } from 'firebase/firestore';
import { FirestorePermissionError } from '@/lib/errors';
import { errorEmitter } from '@/lib/error-emitter';

// A hook for subscribing to a Firestore collection.
export function useCollection<T>(q: Query | CollectionReference | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(data);
        setLoading(false);
      },
      (err) => {
        console.error("useCollection error:", err);
        const path = (q as any).path;
        if (err.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError(
              err.message,
              path, 
              'list'
            );
            errorEmitter.emitPermissionError(permissionError);
        }
        setError(err);
        setLoading(false);
      }
    );

    // Unsubscribe from the listener when the component unmounts.
    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}
