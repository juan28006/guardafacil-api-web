
import { cert, getApps, initializeApp } from 'firebase-admin/app';

import { crearApp } from '../src/app.js';
import { cargarConfig } from '../src/config.js';

const config = cargarConfig();

if (config.modoDatos !== 'firebase') {
  throw new Error('En producción MODO_DATOS debe ser firebase.');
}

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
  throw new Error(
    'Falta configurar FIREBASE_SERVICE_ACCOUNT_JSON en Vercel.',
  );
}

const serviceAccount = JSON.parse(serviceAccountJson);

const firebaseApp =
  getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccount),
  });

const { crearRepoFirestore } = await import('../src/repos/firestore.js');
const { crearAuthFirebase } = await import('../src/auth/firebase.js');

const repo = crearRepoFirestore(firebaseApp);

const auth = crearAuthFirebase({
  app: firebaseApp,
  apiKey: config.firebaseWebApiKey,
});

const app = crearApp({ repo, auth, config });

export default app;
