import admin from 'firebase-admin';

function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svc) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');

  const creds = JSON.parse(svc);
  if (creds.private_key?.includes('\\n')) {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }

  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${creds.project_id}.appspot.com`;

  admin.initializeApp({
    credential: admin.credential.cert(creds),
    storageBucket,
  });

  return admin.app();
}

export const adminApp = getAdminApp;
export const adminDb = () => adminApp().firestore();
export const adminAuth = () => adminApp().auth();
export const adminStorage = () => adminApp().storage();
export const adminFieldValue = () => admin.firestore.FieldValue;
