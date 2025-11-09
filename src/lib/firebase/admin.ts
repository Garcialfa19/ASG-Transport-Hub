import admin from 'firebase-admin';

// Instructions for the user:
// 1. Go to your Firebase project settings -> Service accounts.
// 2. Click "Generate new private key" to download your service account JSON file.
// 3. DO NOT add the file to your project directory.
// 4. Instead, create a `FIREBASE_SERVICE_ACCOUNT` environment variable in your `.env.local` file.
// 5. The value should be the full JSON content of the downloaded file, enclosed in single quotes.
//    Example: FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}


// Use a getter function for Firestore to ensure it's accessed after initialization
function getAdminDb() {
  if (!admin.apps.length) {
    // This will be caught by Next.js and shown in the browser during development
    throw new Error("Firebase Admin SDK not initialized. Check your FIREBASE_SERVICE_ACCOUNT environment variable.");
  }
  return admin.firestore();
}

function getAdminAuth() {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin SDK not initialized.");
    }
    return admin.auth();
}

function getAdminStorage() {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin SDK not initialized.");
    }
    return admin.storage();
}


export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
export const adminStorage = getAdminStorage();
