'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminStorage, adminFieldValue } from './firebase/admin';
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
    const file = formData.get('file') as File | null;
    if (!file) return { success: false, error: 'No file provided.' };

    const bucket = adminStorage().bucket();
    const filename = `${folder}/${uuidv4()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    const fileRef = bucket.file(filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    const token = uuidv4();

    await fileRef.save(buffer, {
      contentType: file.type || 'application/octet-stream',
      metadata: {
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    const publicUrl =
      `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/` +
      `${encodeURIComponent(filename)}?alt=media&token=${token}`;

    return { success: true, data: publicUrl };
  } catch (error: any) {
    console.error('uploadFile error:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
    });
    return { success: false, error: `${error?.code ?? ''} ${error?.message ?? 'Upload failed'}` };
  }
}

// --- Route Actions ---
type RouteData = Omit<Route, 'id' | 'lastUpdated'>;

export async function addRoute(data: Partial<RouteData>) {
  try {
    const id = slugify(`${data.nombre} ${data.especificacion || ''}`) || uuidv4();
    const now = new Date().toISOString();

    const routeDoc = {
      ...data,
      id,
      lastUpdated: now,
    };

    await adminDb().collection('routes').doc(id).set(routeDoc, { merge: false });
    revalidatePath('/admin/dashboard');

    return { success: true, data: routeDoc };
  } catch (error: any) {
    console.error('addRoute error:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
    });
    return { success: false, error: `${error?.code ?? ''} ${error?.message ?? 'Unknown error'}` };
  }
}

export async function updateRoute(id: string, data: Partial<RouteData>) {
 try {
    await adminDb().collection('routes').doc(id).update({
      ...data,
      lastUpdated: new Date().toISOString(),
    });
    revalidatePath('/admin/dashboard');
    return { success: true, data: { id, ...data } };
  } catch (error: any) {
    console.error('updateRoute error:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
    });
    return { success: false, error: `${error?.code ?? ''} ${error?.message ?? 'Unknown error'}` };
  }
}

export async function deleteRoute(id: string) {
  return handleFirestoreAction(() =>
    adminDb().collection('routes').doc(id).delete(),
    '/admin/dashboard'
  );
}


// --- Driver Actions ---
type DriverData = Omit<Driver, 'id' | 'lastUpdated'>;

export async function addDriver(data: DriverData) {
  return handleFirestoreAction(async () => {
    const docRef = await adminDb().collection('drivers').add({
      ...data,
      lastUpdated: new Date().toISOString(),
    });
    return docRef.id;
  }, '/admin/dashboard');
}

export async function updateDriver(id: string, data: Partial<DriverData>) {
  return handleFirestoreAction(() =>
    adminDb().collection('drivers').doc(id).update({
      ...data,
      lastUpdated: new Date().toISOString(),
    }),
    '/admin/dashboard'
  );
}

export async function deleteDriver(id: string) {
  return handleFirestoreAction(() =>
    adminDb().collection('drivers').doc(id).delete(),
    '/admin/dashboard'
  );
}


// --- Alert Actions ---
type AlertData = Omit<Alert, 'id' | 'lastUpdated'>;

export async function addAlert(data: AlertData) {
  return handleFirestoreAction(async () => {
    const docRef = await adminDb().collection('alerts').add({
      ...data,
      lastUpdated: new Date().toISOString(),
    });
    return docRef.id;
  }, '/admin/dashboard');
}

export async function deleteAlert(id: string) {
  return handleFirestoreAction(() =>
    adminDb().collection('alerts').doc(id).delete(),
    '/admin/dashboard'
  );
}
