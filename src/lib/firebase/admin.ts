import admin from 'firebase-admin';

// Instructions for the user:
// 1. Go to your Firebase project settings -> Service accounts.
// 2. Click "Generate new private key" to download your service account JSON file.
// 3. DO NOT add the file to your project directory.
// 4. Instead, create a `FIREBASE_SERVICE_ACCOUNT` environment variable in your `.env.local` file.
// 5. The value should be the full JSON content of the downloaded file, enclosed in single quotes.
//    Example: FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'

try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT as string
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
