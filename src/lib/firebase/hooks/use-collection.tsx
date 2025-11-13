
'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, Query, CollectionReference } from 'firebase/firestore';
import { FirestorePermissionError } from '@/lib/errors';
import { errorEmitter } from '@/lib/error-emitter';

// A hook for subscribing to a Firestore collection.
interface UseCollectionOptions<T> {
  initialData?: T[];
}

function normalizeDocument<T>(doc: any): T {
  if (!doc || typeof doc !== 'object') {
    return doc as T;
  }

  const normalized: Record<string, unknown> = { ...doc };

  if ('lastUpdated' in normalized && normalized.lastUpdated) {
    const value = normalized.lastUpdated as any;
    if (typeof value === 'string') {
      normalized.lastUpdated = value;
    } else if (value instanceof Date) {
      normalized.lastUpdated = value.toISOString();
    } else if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      normalized.lastUpdated = value.toDate().toISOString();
    }
  }

  return normalized as T;
}

export function useCollection<T>(q: Query | CollectionReference | null, options?: UseCollectionOptions<T>) {
  const initialData = options?.initialData ?? null;
  const [data, setData] = useState<T[] | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setData(initialData ?? []);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(!initialData);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...normalizeDocument<T>(doc.data()) });
        });
        setData(data);
        setLoading(false);
      },
      (err) => {
        console.error("useCollection error:", err);
        const path = (q as any)._query?.path?.segments?.join('/') || 'unknown path';
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
  }, [q, initialData]);

  return { data, loading, error };
}
