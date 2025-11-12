import admin from 'firebase-admin';

// Instructions for the user:
// 1. Go to your Firebase project settings -> Service accounts.
// 2. Click "Generate new private key" to download your service account JSON file.
// 3. DO NOT add the file to your project directory.
// 4. Instead, create a `FIREBASE_SERVICE_ACCOUNT` environment variable in your `.env.local` file.
// 5. The value should be the full JSON content of the downloaded file, enclosed in single quotes.
//    Example: FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // Throw a more specific error to help with debugging
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check your FIREBASE_SERVICE_ACCOUNT environment variable. Original error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// A function to get the initialized admin app
const getAdminApp = () => {
    initializeAdminApp();
    return admin;
};


// Use a getter function for Firestore to ensure it's accessed after initialization
function getAdminDb() {
  const adminApp = getAdminApp();
  return adminApp.firestore();
}

function getAdminAuth() {
    const adminApp = getAdminApp();
    return adminApp.auth();
}

function getAdminStorage() {
    const adminApp = getAdminApp();
    return adminApp.storage();
}

// Export getters instead of direct instances
export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
export const adminStorage = getAdminStorage();
