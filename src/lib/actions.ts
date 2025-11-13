'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminStorage, adminFieldValue } from './firebase/admin';
import { slugify } from './utils';
import type { Route, Driver, Alert } from './definitions';
import { v4 as uuidv4 } from 'uuid';

// --- Generic Error Handling ---
// I route all Firestore mutations through this helper so revalidation and error formatting stay
// consistent across the dashboard.
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
// Uploading from a server action keeps my service account credentials off the client and lets me
// generate publicly cacheable URLs in one shot.
export async function uploadFile(formData: FormData, folder: string) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) return { success: false, error: 'No file provided.' };

    const bucket = adminStorage().bucket();
    const filename = `${folder}/${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
    const fileRef = bucket.file(filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    
    await fileRef.save(buffer, {
      contentType: file.type,
      public: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
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

function serializeTimestamp(value: unknown): string {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as any).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return new Date(value as any).toISOString();
}

export async function addRoute(data: Partial<RouteData>) {
  try {
    // I prefer deterministic IDs so I can reference routes in other collections without
    // additional lookups.
    const id = slugify(`${data.nombre} ${data.especificacion || ''}`) || uuidv4();
    const FieldValue = adminFieldValue();

    const routeDoc = {
      ...data,
      id,
      lastUpdated: FieldValue.serverTimestamp(),
    };

    await adminDb().collection('routes').doc(id).set(routeDoc, { merge: false });
    revalidatePath('/admin/dashboard');
    revalidatePath('/');

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
    const FieldValue = adminFieldValue();
    await adminDb().collection('routes').doc(id).update({
      ...data,
      lastUpdated: FieldValue.serverTimestamp(),
    });
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
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
  const result = await handleFirestoreAction(() =>
    adminDb().collection('routes').doc(id).delete(),
    '/admin/dashboard'
  );
   if (result.success) {
    // Removing a route affects both the admin list and the passenger homepage, so I manually
    // invalidate the public path as well.
    revalidatePath('/');
  }
  return result;
}

export async function getRoutes(): Promise<Route[]> {
  const snapshot = await adminDb().collection('routes').orderBy('nombre', 'asc').get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Route;
    return {
      ...data,
      lastUpdated: serializeTimestamp((data as any).lastUpdated),
    };
  });
}


// --- Driver Actions ---
type DriverData = Omit<Driver, 'id' | 'lastUpdated'>;

export async function addDriver(data: DriverData) {
  // Drivers are lightweight so I let Firestore generate the ID and only return it to the client.
  return handleFirestoreAction(async () => {
    const docRef = await adminDb().collection('drivers').add({
      ...data,
      lastUpdated: adminFieldValue().serverTimestamp(),
    });
    return docRef.id;
  }, '/admin/dashboard');
}

export async function updateDriver(id: string, data: Partial<DriverData>) {
  return handleFirestoreAction(() =>
    adminDb().collection('drivers').doc(id).update({
      ...data,
      lastUpdated: adminFieldValue().serverTimestamp(),
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
  // Alerts are tiny, so I create them ad-hoc and revalidate the landing page immediately.
  return handleFirestoreAction(async () => {
    const docRef = await adminDb().collection('alerts').add({
      ...data,
      lastUpdated: adminFieldValue().serverTimestamp(),
    });
    revalidatePath('/');
    return docRef.id;
  }, '/admin/dashboard');
}

export async function deleteAlert(id: string) {
  const result = await handleFirestoreAction(() =>
    adminDb().collection('alerts').doc(id).delete(),
    '/admin/dashboard'
  );
  if (result.success) {
    // Alerts also power the hero banner on the passenger site so I invalidate the root path.
    revalidatePath('/');
  }
  return result;
}

export async function getAlerts(): Promise<Alert[]> {
  const snapshot = await adminDb().collection('alerts').orderBy('lastUpdated', 'desc').get();
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Alert;
    return {
      ...data,
      lastUpdated: serializeTimestamp((data as any).lastUpdated),
    };
  });
}

export async function getDrivers(): Promise<Driver[]> {
  const snapshot = await adminDb().collection('drivers').orderBy('nombre', 'asc').get();
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Driver;
    return {
      ...data,
      lastUpdated: serializeTimestamp((data as any).lastUpdated),
    };
  });
}