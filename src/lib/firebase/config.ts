// This file contains the Firebase configuration for the client-side app.
// It's important to keep this information secure.
// For production, it's recommended to use environment variables.

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Instructions for the user:
// 1. Create a `.env.local` file in the root of your project.
// 2. Add your Firebase config values to this file, for example:
//    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
//    ...and so on for all the keys in firebaseConfig.
// 3. Make sure `.env.local` is in your `.gitignore` file to avoid committing secrets.
