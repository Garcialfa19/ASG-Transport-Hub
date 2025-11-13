
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

  // Use a ref to memoize the query object. This is important to prevent re-renders.
  const queryRef = useRef(q);

  useEffect(() => {
    // If the query is not ready, do nothing.
    if (!queryRef.current) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      queryRef.current,
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
        const permissionError = new FirestorePermissionError(
          err.message,
          // The path property exists on both Query and CollectionReference
          (queryRef.current as any).path, 
          'list'
        );
        errorEmitter.emitPermissionError(permissionError);
        setError(err);
        setLoading(false);
      }
    );

    // Unsubscribe from the listener when the component unmounts.
    return () => unsubscribe();
  }, [q]); // Re-run effect if the query object itself changes.

  return { data, loading, error };
}
