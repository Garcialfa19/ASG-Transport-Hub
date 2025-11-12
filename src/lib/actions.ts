'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminStorage } from './firebase/admin';
import { slugify } from './utils';
import type { Route, Driver, Alert } from './definitions';
import { v4 as uuidv4 } from 'uuid';

// --- Generic Error Handling ---
async function handleFirestoreAction(action: () => Promise<any>, revalidate: string) {
  try {
    const result = await action();
    revalidatePath(revalidate);
    return { success: true, data: result };
  } catch (error) {
    console.error('Server Action Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

// --- File Upload Action ---
export async function uploadFile(formData: FormData, folder: string) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided.' };
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      throw new Error("Firebase Storage bucket name is not configured. Check NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable.");
    }
    const bucket = adminStorage.bucket(bucketName);
    
    const filename = `${folder}/${uuidv4()}-${slugify(file.name)}`;
    const fileRef = bucket.file(filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fileRef.save(buffer, {
      contentType: file.type,
      public: true, // Make the file public on upload
    });
    
    const publicUrl = fileRef.publicUrl();

    return { success: true, data: publicUrl };

  } catch (error) {
    console.error('File Upload Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'File upload failed.';
    return { success: false, error: errorMessage };
  }
}


// --- Route Actions ---
type RouteData = Omit<Route, 'id' | 'lastUpdated'>;

export async function addRoute(data: RouteData) {
  const id = slugify(`${data.nombre} ${data.especificacion}`);
  return handleFirestoreAction(async () => {
    const newRoute = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    await adminDb.collection('routes').doc(id).set(newRoute);
    return { ...newRoute, id };
  }, '/admin/dashboard');
}

export async function updateRoute(id: string, data: Partial<RouteData>) {
  return handleFirestoreAction(() =>
    adminDb.collection('routes').doc(id).update({
      ...data,
      lastUpdated: new Date().toISOString(),
    }),
    '/admin/dashboard'
  );
}

export async function deleteRoute(id: string) {
  return handleFirestoreAction(() =>
    adminDb.collection('routes').doc(id).delete(),
    '/admin/dashboard'
  );
}


// --- Driver Actions ---
type DriverData = Omit<Driver, 'id' | 'lastUpdated'>;

export async function addDriver(data: DriverData) {
  return handleFirestoreAction(async () => {
    const docRef = await adminDb.collection('drivers').add({
      ...data,
      lastUpdated: new Date().toISOString(),
    });
    return docRef.id;
  }, '/admin/dashboard');
}

export async function updateDriver(id: string, data: Partial<DriverData>) {
  return handleFirestoreAction(() =>
    adminDb.collection('drivers').doc(id).update({
      ...data,
      lastUpdated: new Date().toISOString(),
    }),
    '/admin/dashboard'
  );
}

export async function deleteDriver(id: string) {
  return handleFirestoreAction(() =>
    adminDb.collection('drivers').doc(id).delete(),
    '/admin/dashboard'
  );
}


// --- Alert Actions ---
type AlertData = Omit<Alert, 'id' | 'lastUpdated'>;

export async function addAlert(data: AlertData) {
  return handleFirestoreAction(async () => {
    const docRef = await adminDb.collection('alerts').add({
      ...data,
      lastUpdated: new Date().toISOString(),
    });
    return docRef.id;
  }, '/admin/dashboard');
}

export async function deleteAlert(id: string) {
  return handleFirestoreAction(() =>
    adminDb.collection('alerts').doc(id).delete(),
    '/admin/dashboard'
  );
}
