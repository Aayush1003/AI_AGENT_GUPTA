import admin from 'firebase-admin';
import path from 'path';

let db: admin.firestore.Firestore;

export const initFirebase = async () => {
  try {
    // Check for service account key file
    const serviceAccountPath = process.env.FIREBASE_KEY_PATH || 
      path.join(__dirname, '../../firebase-key.json');

    // If using environment variable JSON string
    if (process.env.FIREBASE_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Try to load from file
      try {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (err) {
        // Fall back to Application Default Credentials (for Google Cloud)
        admin.initializeApp();
      }
    }

    db = admin.firestore();
    
    // Test connection
    await db.collection('_test').doc('_test').get();
    console.log('✅ Firebase Firestore connected successfully');
    
    return db;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    throw error;
  }
};

export const getFirestore = (): admin.firestore.Firestore => {
  if (!db) {
    throw new Error('Firebase not initialized. Call initFirebase() first.');
  }
  return db;
};

export const disconnectFirebase = async () => {
  try {
    await admin.app().delete();
    console.log('✅ Firebase disconnected');
  } catch (error) {
    console.error('❌ Firebase disconnection failed:', error);
  }
};
