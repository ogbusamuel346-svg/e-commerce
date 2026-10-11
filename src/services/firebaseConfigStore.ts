export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId?: string;
  appId: string;
  firestoreDatabaseId?: string;
}

export const FIREBASE_STORAGE_KEY = 'novamobile_custom_firebase_config';

export function getStoredFirebaseConfig(): FirebaseCustomConfig | null {
  try {
    const raw = localStorage.getItem(FIREBASE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.apiKey && parsed.projectId) {
      return parsed;
    }
    return null;
  } catch (e) {
    console.error('Failed to parse custom Firebase config', e);
    return null;
  }
}

export function saveStoredFirebaseConfig(config: FirebaseCustomConfig): void {
  localStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(config));
}

export function clearStoredFirebaseConfig(): void {
  localStorage.removeItem(FIREBASE_STORAGE_KEY);
}
