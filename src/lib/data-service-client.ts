'use client';

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  query,
  Firestore,
} from 'firebase/firestore';
import { FirestorePermissionError } from './errors';
import { errorEmitter } from './error-emitter';

// This file is now mostly deprecated in favor of useCollection hook and server actions.
// However, the error handling pattern is kept for reference.

// Generic function to handle Firestore errors and emit permission errors
async function handleFirestoreError<T>(
  firestore: Firestore,
  promise: Promise<T>,
  refPath: string,
  operation: 'get' | 'list' | 'create' | 'update' | 'delete',
  resource?: any
): Promise<T> {
  try {
    return await promise;
  } catch (e: any) {
    if (e.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError(
        e.message,
        refPath,
        operation,
        resource
      );
      errorEmitter.emitPermissionError(permissionError);
    }
    // Re-throw the original error after emitting
    throw e;
  }
}

// Generic function to get a collection
export async function getCollection<T>(firestore: Firestore, collectionName: string, order?: {field: string, direction: 'asc' | 'desc'}): Promise<T[]> {
  const collRef = collection(firestore, collectionName);
  const q = order ? query(collRef, orderBy(order.field, order.direction)) : collRef;
  const promise = getDocs(q);
  
  const querySnapshot = await handleFirestoreError(firestore, promise, collectionName, 'list');

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
}

// Generic function to get a document
export async function getDocument<T>(firestore: Firestore, collectionName:string, id: string): Promise<T | null> {
  const docRef = doc(firestore, collectionName, id);
  const promise = getDoc(docRef);

  const docSnap = await handleFirestoreError(firestore, promise, docRef.path, 'get');

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}
