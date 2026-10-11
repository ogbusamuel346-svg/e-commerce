import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from '../types/auth';

export const ADMIN_EMAILS = [
  'sameduhub2025@gmail.com',
  'ogbusamuel346@gmail.com',
  'admin@novamobile.com',
];

export function isAdministratorEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === email.toLowerCase().trim());
}

export interface FirebaseAuthResult {
  success: boolean;
  message: string;
  user?: User;
  firebaseUser?: FirebaseUser;
  isAdmin?: boolean;
  needsEmailPasswordProviderEnabled?: boolean;
}

export async function loginWithFirebaseAuth(
  email: string,
  pass: string
): Promise<FirebaseAuthResult> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Attempt standard Firebase Auth sign in
    let userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass).catch(
      async (signInError: any) => {
        // If user not found and is the requested admin account, auto-bootstrap account creation in Firebase Auth
        if (
          (signInError.code === 'auth/user-not-found' ||
            signInError.code === 'auth/invalid-credential') &&
          cleanEmail === 'sameduhub2025@gmail.com'
        ) {
          try {
            return await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          } catch (createError: any) {
            throw createError;
          }
        }
        throw signInError;
      }
    );

    const fbUser = userCredential.user;

    // Check if Administrator
    const isAdmin = isAdministratorEmail(fbUser.email);
    const role: UserRole = isAdmin ? 'admin' : 'customer';

    if (isAdmin && !fbUser.displayName) {
      try {
        await updateProfile(fbUser, { displayName: 'Samuel (Administrator)' });
      } catch {
        // Non-blocking
      }
    }

    // Persist or verify admin doc in Firestore
    if (isAdmin) {
      try {
        await setDoc(
          doc(db, 'admins', fbUser.uid),
          {
            email: fbUser.email,
            role: 'admin',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Could not write admin record to Firestore:', e);
      }
    }

    const appUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || (isAdmin ? 'Samuel (Administrator)' : cleanEmail.split('@')[0]),
      email: fbUser.email || cleanEmail,
      role,
      phone: fbUser.phoneNumber || undefined,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    return {
      success: true,
      message: isAdmin ? 'Authenticated as Administrator via Firebase' : 'Authenticated via Firebase',
      user: appUser,
      firebaseUser: fbUser,
      isAdmin,
    };
  } catch (error: any) {
    const errorCode = error?.code || '';
    console.error('Firebase Auth Error:', errorCode, error?.message);

    if (errorCode === 'auth/operation-not-allowed') {
      return {
        success: false,
        needsEmailPasswordProviderEnabled: true,
        message:
          'Email/Password sign-in is disabled in your Firebase project. Please enable Email/Password provider in the Firebase Console under Authentication > Sign-in method.',
      };
    }

    if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
      return {
        success: false,
        message: 'Invalid email or password for this Firebase account. Please verify credentials.',
      };
    }

    if (errorCode === 'auth/user-not-found') {
      return {
        success: false,
        message: 'No Firebase user account found with this email.',
      };
    }

    if (errorCode === 'auth/too-many-requests') {
      return {
        success: false,
        message: 'Too many unsuccessful attempts. Access temporarily blocked for security. Please try again later.',
      };
    }

    return {
      success: false,
      message: error?.message || 'Authentication failed via Firebase.',
    };
  }
}

export async function createAdminInFirebaseAuth(
  email: string,
  pass: string
): Promise<FirebaseAuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    await updateProfile(cred.user, { displayName: 'Samuel (Administrator)' });

    try {
      await setDoc(
        doc(db, 'admins', cred.user.uid),
        {
          email: cred.user.email,
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch {
      // ignore
    }

    const appUser: User = {
      id: cred.user.uid,
      name: 'Samuel (Administrator)',
      email: cred.user.email || cleanEmail,
      role: 'admin',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    return {
      success: true,
      message: 'Administrator account created successfully in Firebase Auth!',
      user: appUser,
      firebaseUser: cred.user,
      isAdmin: true,
    };
  } catch (err: any) {
    if (err?.code === 'auth/email-already-in-use') {
      // Try to sign in instead
      return loginWithFirebaseAuth(cleanEmail, pass);
    }
    if (err?.code === 'auth/operation-not-allowed') {
      return {
        success: false,
        needsEmailPasswordProviderEnabled: true,
        message:
          'Email/Password sign-in is disabled in your Firebase project. Please enable Email/Password in Firebase Console (Authentication > Sign-in method).',
      };
    }
    return {
      success: false,
      message: err?.message || 'Failed to create admin in Firebase Auth',
    };
  }
}

export async function loginWithFirebaseGoogle(): Promise<FirebaseAuthResult> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;
    const isAdmin = isAdministratorEmail(fbUser.email);
    const role: UserRole = isAdmin ? 'admin' : 'customer';

    if (isAdmin) {
      try {
        await setDoc(
          doc(db, 'admins', fbUser.uid),
          {
            email: fbUser.email,
            role: 'admin',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch {
        // ignore
      }
    }

    const appUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Google User',
      email: fbUser.email || '',
      role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    return {
      success: true,
      message: `Signed in as ${appUser.name} via Firebase Google`,
      user: appUser,
      firebaseUser: fbUser,
      isAdmin,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Google sign-in failed',
    };
  }
}

export async function logoutFirebaseAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Error signing out from Firebase:', err);
  }
}
