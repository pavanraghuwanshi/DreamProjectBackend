import admin from 'firebase-admin';

let firebaseInitialized = false;

try { 
  if (!process.env.FIREBASE_CONFIG) {
    console.warn('⚠️  FIREBASE_CONFIG not found in environment variables. Firebase Admin not initialized.');
  } else {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

    // Fix newline characters in private key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized from ENV');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
}

export default firebaseInitialized ? admin : null;
