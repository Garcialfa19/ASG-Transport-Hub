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
} from 'firebase/firestore';
import { firestore } from './firebase/client';
import type { Route, Alert, Driver } from './definitions';
import { FirestorePermissionError } from './errors';
import { errorEmitter } from './error-emitter';

// Generic function to handle Firestore errors and emit permission errors
async function handleFirestoreError<T>(
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
export async function getCollection<T>(collectionName: string, order?: {field: string, direction: 'asc' | 'desc'}): Promise<T[]> {
  const collRef = collection(firestore, collectionName);
  const q = order ? query(collRef, orderBy(order.field, order.direction)) : collRef;
  const promise = getDocs(q);
  
  const querySnapshot = await handleFirestoreError(promise, collectionName, 'list');

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
}

// Generic function to get a document
export async function getDocument<T>(collectionName:string, id: string): Promise<T | null> {
  const docRef = doc(firestore, collectionName, id);
  const promise = getDoc(docRef);

  const docSnap = await handleFirestoreError(promise, docRef.path, 'get');

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

// Generic function to add a document with an auto-generated ID
export async function addDocument<T extends object>(collectionName: string, data: T) {
  const enrichedData = {
    ...data,
    lastUpdated: Timestamp.now().toDate().toISOString(),
  };
  const promise = addDoc(collection(firestore, collectionName), enrichedData);
  
  const docRef = await handleFirestoreError(promise, collectionName, 'create', enrichedData);
  return docRef.id;
}

// Generic function to set a document with a specific ID
export async function setDocument<T extends object>(collectionName: string, id: string, data: T) {
   const enrichedData = {
    ...data,
    lastUpdated: Timestamp.now().toDate().toISOString(),
  };
  const docRef = doc(firestore, collectionName, id);
  const promise = setDoc(docRef, enrichedData);
  
  await handleFirestoreError(promise, docRef.path, 'create', enrichedData);
}

// Generic function to update a document
export async function updateDocument<T extends object>(collectionName: string, id: string, data: Partial<T>) {
    const enrichedData = {
    ...data,
    lastUpdated: Timestamp.now().toDate().toISOString(),
  };
  const docRef = doc(firestore, collectionName, id);
  const promise = updateDoc(docRef, enrichedData);
  
  await handleFirestoreError(promise, docRef.path, 'update', enrichedData);
}

// Generic function to delete a document
export async function deleteDocument(collectionName: string, id: string) {
  const docRef = doc(firestore, collectionName, id);
  const promise = deleteDoc(docRef);

  await handleFirestoreError(promise, docRef.path, 'delete');
}

// Specific functions
export const getClientRoutes = () => getCollection<Route>('routes', {field: 'nombre', direction: 'asc'});
export const getAlerts = () => getCollection<Alert>('alerts', {field: 'lastUpdated', direction: 'desc'});
export const getDrivers = () => getCollection<Driver>('drivers', {field: 'nombre', direction: 'asc'});