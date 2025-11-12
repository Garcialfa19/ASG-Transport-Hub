import admin from 'firebase-admin';

// This function ensures the Firebase Admin SDK is initialized only once.
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

    // Fix for private key format issues when stored in environment variables
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

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
    return initializeAdminApp();
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
