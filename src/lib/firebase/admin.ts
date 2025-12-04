import admin from 'firebase-admin';

function getAdminApp() {
  // The Admin SDK must only be initialized once per runtime; Firebase caches apps internally,
  // so I reuse the existing instance when it already exists.
  if (admin.apps.length) return admin.app();

  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svc) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');

  // The service account is injected as a JSON string via environment variables to avoid
  // shipping a credentials file with the repo.
  const creds = JSON.parse(svc);
  if (creds.private_key?.includes('\\n')) {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }

  // Allow overriding the storage bucket for staging/production; otherwise fall back to the
  // project default inferred from the service account.
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${creds.project_id}.appspot.com`;

  admin.initializeApp({
    credential: admin.credential.cert(creds),
    storageBucket,
  });

  return admin.app();
}

// Expose memoized helpers so server actions can access Admin SDK services without duplicating
// initialization logic.
export const adminApp = getAdminApp;
export const adminDb = () => adminApp().firestore();
export const adminAuth = () => adminApp().auth();
export const adminStorage = () => adminApp().storage();
export const adminFieldValue = () => admin.firestore.FieldValue;
