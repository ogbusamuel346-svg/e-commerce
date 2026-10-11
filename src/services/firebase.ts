import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';
import { getStoredFirebaseConfig } from './firebaseConfigStore';

export function getActiveFirebaseConfig() {
  const custom = getStoredFirebaseConfig();
  if (custom && custom.apiKey && custom.projectId) {
    return {
      apiKey: custom.apiKey,
      authDomain: custom.authDomain || `${custom.projectId}.firebaseapp.com`,
      projectId: custom.projectId,
      messagingSenderId: custom.messagingSenderId || appletConfig.messagingSenderId,
      appId: custom.appId || appletConfig.appId,
      firestoreDatabaseId: custom.firestoreDatabaseId || appletConfig.firestoreDatabaseId,
    };
  }
  return appletConfig;
}

const activeConfig = getActiveFirebaseConfig();

export const app = !getApps().length ? initializeApp(activeConfig) : getApp();
export const db = activeConfig.firestoreDatabaseId
  ? getFirestore(app, activeConfig.firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

// Connection test according to Firebase skill
export async function validateFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline. Check Firebase configuration.');
    }
    return false;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
