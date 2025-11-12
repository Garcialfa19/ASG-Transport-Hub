
'use client';

import { useEffect, useState, useRef } from 'react';
import { onSnapshot, query, collection, where, Query, DocumentData, CollectionReference } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';

// A hook for subscribing to a Firestore collection.
export function useCollection<T>(q: Query | CollectionReference | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRef = useRef(q);

  useEffect(() => {
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
          (queryRef.current as Query).path,
          'list'
        );
        errorEmitter.emitPermissionError(permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}
