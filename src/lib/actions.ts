'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from './firebase/admin';
import { slugify } from './utils';
import type { Route, Driver, Alert } from './definitions';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use a timestamp and slugified name to create a unique filename
    const filename = `${Date.now()}-${slugify(file.name)}`;
    const path = join(process.cwd(), 'public', 'uploads', folder, filename);
    
    // IMPORTANT: Writing to the local filesystem is not suitable for most production serverless environments (like Vercel or Firebase App Hosting).
    // The 'public' directory is only available at build time. For a production app,
    // you should use a cloud storage service like Firebase Storage.
    // This implementation is for local development demonstration as per the prompt.
    await writeFile(path, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;
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
    await adminDb.collection('routes').doc(id).set({
      ...data,
      lastUpdated: new Date().toISOString(),
    });
    return id;
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
