// This script uses the Firebase Admin SDK to check the custom claims of a user.
// It requires a service account key to be set up for authentication.

const admin = require('firebase-admin');

// --- IMPORTANT ---
// Before running, you must set up authentication. Choose ONE of the following options:

// Option 1: Using a Service Account JSON file (Recommended for local use)
// 1. Download your service account key from Firebase Console > Project Settings > Service accounts.
// 2. Place the JSON file in this 'AdminScript' directory.
// 3. Uncomment the two lines below and update the path to your file.

// const serviceAccount = require('./your-service-account-file.json');
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });


// Option 2: Using Google Application Default Credentials
// 1. Make sure you have the gcloud CLI installed and authenticated: `gcloud auth application-default login`
// 2. Uncomment the line below. This is useful in Cloud Shell or other authenticated environments.

admin.initializeApp();


// --- User ID to check ---
// Replace this with the UID of the user you want to verify.
const uid = "3TZ48ASVmQc43OSDdWRbx610jBV2";


async function checkUserClaims() {
  if (!uid || uid.startsWith("REPLACE")) {
    console.error("❌ Error: Please replace 'REPLACE_WITH_YOUR_USER_ID' with a valid user UID in check-claims.js");
    return;
  }
    
  if (!admin.apps.length) {
    console.error("❌ Error: Firebase Admin SDK not initialized. Please follow the authentication instructions in the script.");
    return;
  }

  try {
    console.log(`🔍 Checking claims for user UID: ${uid}`);
    const userRecord = await admin.auth().getUser(uid);
    const claims = userRecord.customClaims || {};

    console.log("-----------------------------------------");
    if (claims.admin === true) {
      console.log("✅ Success! The user has the admin claim.");
      console.log("Custom Claims:", claims);
    } else {
      console.log("❌ Failure! The user does NOT have the admin claim.");
      console.log("Current Claims:", claims);
      console.log("\nNext Step: Please run the grant-admin.mjs script again to set the claim.");
    }
    console.log("-----------------------------------------");

  } catch (error) {
    console.error(`❌ Error fetching user data for UID: ${uid}`, error.message);
  }
}

checkUserClaims();
