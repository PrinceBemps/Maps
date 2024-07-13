// setup-admins.js
const admin = require("firebase-admin");

// Path to your service account key
const serviceAccount = require("charter-f5944-firebase-adminsdk-tyche-5d9bf0b648");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const predefinedAdmins = [
  { email: "admin1@example.com", password: "password1" },
  { email: "admin2@example.com", password: "password2" }
];

predefinedAdmins.forEach(async adminUser => {
  const { email, password } = adminUser;

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false
    });

    // Add user to Firestore with role 'admin'
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role: "admin"
    });

    console.log(`Successfully created admin: ${email}`);
  } catch (error) {
    console.error(`Error creating admin ${email}:`, error);
  }
});
