import admin from 'firebase-admin';

// Initialize the Firebase Admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert({
    "project_id": "asg-project-3b923",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCKExWEw+uLDRff\ncejHZUr4aRCc20DO3dsw5ggwgLpsH7K+REcwkeBvmL/oJP8LMV2ahcfmRZ0dKBlW\nZCsiBY2N1gXwKEYDV6Cq/FUM6SESGv9Q89W0YGYcZMaZFZcq9a/ngciPjv7YBYDX\nMF9ZJ6WVkpFABOMQmtRjG/WgnznGK8iZn1VcF8NrahdR1k9LzIhjk41y41suV7U2\ncOzpUpLJxnCDqLBz1i8jzna8MqaeouTgAsXT6qAR1hy3hdDdNMTUuDEfqTOSl5ih\n+vgTkMNhi4bwcK96dKZ0RkvsW/HIPcTTDq6gQDxk/AKb3B9OE4owUu1VOS2yxj7e\nTmbQv4YvAgMBAAECggEAHz0lG7Yl9v5d3diMRXy14xEGSK7UcVlBi8Unqi2dv/PG\nAYU6JBOFF0qUdKXWLEademX1LbSnUN7vKJweJCLkfWgkTMsX2A6906GmbnbaXBnO\nlRatzZMX1ym3ww/e9UHD7BlxcoV0RBSuq0EO+YFeVcJk6XqRkwKstcWwI4iSzjJp\nqeo3zx2+hEC0vEMwl5ZjKanZDGz4842Lbjmmd22Tbm2gwdukPS2VCppnqjHdpPKy\nXUBfDIe6ml8Ig8biuLX6XVZZGHJHN4EmJPbOIvmMDariRGHgWeWfK47giamIR4YA\noLajgBJRZTdaGAKbTLH9rpBnukFgUil7XTikt/obNQKBgQC+nsNoyA6ESNJXv6kO\nGLGM1LpXdIzu281D44Bm75m668IswO1JoFNCr2AAHs1avooEIEN9pnlDCnfDt/bC\nuTWtYTFZupc5aaEGD1bN+9aLkWwPDj78YTkBUaR5brrTwWA4k4JXvOt9RBh0PndL\nHnF6B0qv86pdN61/7rIqtGOK+wKBgQC5bpk3Un8Wi26UYfKbdRfp67NcpUZMrvhe\n3xaq4xzNeTinHRUpbykSWUhqMNcRfNVkNQ9uNuhyq0PQH3d2XETb6lVph/laqu3t\nwdHAYa4HPgIrnCEhLUdDbaYPJsIafsAOZfnZVyHJ9AMnnP7WfpCKgmDQXaDUTe8r\ntkOEvlPLXQKBgQCzy133HBONNH6p445aTHJTqmakjLtNpKbErPX0oXR3+V1qBwMJ\nmh5OXMqI8oSxXd0iLShbgMUJtfrm8ULfwf/eLDl3L+bpcTc/VwKCQVLIy/6HaOGB\n/VXeZ5piK04u40uVsZSUmw3nVm5WXoD4qptQBUauFX+Qcy7D52nHm+P0NwKBgF6x\n+FSkMHqW4fWsv3RcK8Yts/8P+AKZKAVq7+x85uyXhzLwSypJtjPEnJJ+NpabpW3z\nGtox+Cr3Az55k0xCenfEB7JI2jJPMApG/JK+T10rcXhL1y9WLBpnGHKMXHujVvkD\nYsB3Gq5DiojkR8/J+o6BXmeKKOPCmO09uuVDPQ+RAoGBAKdCaqBOmCblwqHDoPNQ\nsnSyCVSXqeMW73irqyjmwIL/cIZjnOQaObyLpsUwAFpoGlknHDxveCdUaBNSpAT8\nRP7aDz0m4s65no+RjCQKyHqKAR9Rk7K5qrdjU1buw1Oc2LPXrjklgEpubgDoKAkH\nGFzHyqqMVQBmgyhDn4fnv7Q+\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-fbsvc@asg-project-3b923.iam.gserviceaccount.com"
  })
});

const uid = "3TZ48ASVmQc43OSDdWRbx610jBV2";

async function grantAdminRole() {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Successfully granted admin role to user: ${uid}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting custom claims:', error);
    process.exit(1);
  }
}

grantAdminRole();
