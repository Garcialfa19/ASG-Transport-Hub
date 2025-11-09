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

// Generic function to get a collection
export async function getCollection<T>(collectionName: string, order?: {field: string, direction: 'asc' | 'desc'}): Promise<T[]> {
  const collRef = collection(firestore, collectionName);
  const q = order ? query(collRef, orderBy(order.field, order.direction)) : collRef;
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
}

// Generic function to get a document
export async function getDocument<T>(collectionName:string, id: string): Promise<T | null> {
  const docRef = doc(firestore, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

// Generic function to add a document with an auto-generated ID
export async function addDocument<T extends object>(collectionName: string, data: T) {
  const docRef = await addDoc(collection(firestore, collectionName), {
    ...data,
    lastUpdated: Timestamp.now().toDate().toISOString(),
  });
  return docRef.id;
}

// Generic function to set a document with a specific ID
export async function setDocument<T extends object>(collectionName: string, id: string, data: T) {
  await setDoc(doc(firestore, collectionName, id), {
    ...data,
    lastUpdated: Timestamp.now().toDate().toISOString(),
  });
}

// Generic function to update a document
export async function updateDocument<T extends object>(collectionName: string, id: string, data: Partial<T>) {
  await updateDoc(doc(firestore, collectionName, id), {
    ...data,
    lastUpdated: Timestamp.now().toDate().toISOString(),
  });
}

// Generic function to delete a document
export async function deleteDocument(collectionName: string, id: string) {
  await deleteDoc(doc(firestore, collectionName, id));
}

// Specific functions
export const getRoutes = () => getCollection<Route>('routes', {field: 'nombre', direction: 'asc'});
export const getAlerts = () => getCollection<Alert>('alerts', {field: 'lastUpdated', direction: 'desc'});
export const getDrivers = () => getCollection<Driver>('drivers', {field: 'nombre', direction: 'asc'});