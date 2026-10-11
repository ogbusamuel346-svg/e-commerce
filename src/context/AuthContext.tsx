import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';
import { useToast } from './ToastContext';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  loginWithFirebaseAuth,
  loginWithFirebaseGoogle,
  createAdminInFirebaseAuth,
  logoutFirebaseAuth,
  isAdministratorEmail,
  sendFirebasePasswordReset,
} from '../services/firebaseAuth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  usersList: User[];
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string; isAdmin?: boolean; needsEmailPasswordProviderEnabled?: boolean }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string; isAdmin?: boolean }>;
  createFirebaseAdmin: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, pass: string, phone?: string) => { success: boolean; message: string };
  logout: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  loginAsAdminDemo: () => void;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string; sentEmail?: boolean }>;
}

const USERS_STORAGE_KEY = 'novamobile_registered_users';
const CURRENT_USER_STORAGE_KEY = 'novamobile_session_user';

const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-samuel',
    name: 'Samuel (Administrator)',
    email: 'sameduhub2025@gmail.com',
    role: 'admin',
    phone: '+234 903 448 6697',
    joinedDate: 'Jan 10, 2025',
    password: 'Samuel09034486697@',
  },
  {
    id: 'user-admin-1',
    name: 'Nova Administrator',
    email: 'admin@novamobile.com',
    role: 'admin',
    phone: '+1 (800) 555-0199',
    joinedDate: 'Jan 15, 2025',
    password: 'admin123',
  },
  {
    id: 'user-alex-2',
    name: 'Alex Rivers',
    email: 'alex.rivers@novamobile.demo',
    role: 'customer',
    phone: '+1 (555) 019-2834',
    joinedDate: 'Feb 10, 2025',
    password: 'demo123',
  },
  {
    id: 'user-sarah-3',
    name: 'Sarah Connor',
    email: 'sarah.c@techmail.com',
    role: 'customer',
    phone: '+1 (555) 234-8899',
    joinedDate: 'Mar 01, 2025',
    password: 'password123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      let list: User[] = stored ? JSON.parse(stored) : INITIAL_USERS;
      // Ensure Samuel Admin is always present with admin role and current password
      const samuelIndex = list.findIndex(
        (u) => u.email.toLowerCase() === 'sameduhub2025@gmail.com'
      );
      if (samuelIndex === -1) {
        list = [INITIAL_USERS[0], ...list];
      } else {
        list[samuelIndex] = {
          ...list[samuelIndex],
          role: 'admin',
          password: 'Samuel09034486697@',
          name: list[samuelIndex].name || 'Samuel (Administrator)',
        };
      }
      return list;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clear any auto-assigned demo user from old sessions so visitors aren't auto-signed in
        if (parsed?.email === 'alex.rivers@novamobile.demo') {
          localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const isAdmin = isAdministratorEmail(fbUser.email);
        const role: UserRole = isAdmin ? 'admin' : 'customer';
        const mappedUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || (isAdmin ? 'Samuel (Administrator)' : (fbUser.email?.split('@')[0] || 'User')),
          email: fbUser.email || '',
          role,
          phone: fbUser.phoneNumber || undefined,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        setCurrentUser(mappedUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch {
      // ignore
    }
  }, [usersList]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; message: string; isAdmin?: boolean; needsEmailPasswordProviderEnabled?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Dedicated, resilient administrator authentication for sameduhub2025@gmail.com
    if (cleanEmail === 'sameduhub2025@gmail.com') {
      if (pass !== 'Samuel09034486697@') {
        return { success: false, message: 'Invalid administrator password.' };
      }

      // Try Firebase Auth in background
      try {
        const fbRes = await loginWithFirebaseAuth(cleanEmail, pass);
        if (fbRes.success && fbRes.user) {
          setCurrentUser(fbRes.user);
          showToast('Signed in as Administrator.', 'success');
          return { success: true, message: 'Signed in as Administrator.', isAdmin: true };
        }

        // If user doesn't exist yet in Firebase, try auto-registering admin account
        try {
          await createAdminInFirebaseAuth(cleanEmail, pass);
        } catch {
          // ignore
        }
      } catch (fbErr: any) {
        console.warn('Firebase Auth invocation warning:', fbErr);
      }

      // Guaranteed administrator clearance
      const adminUser: User = {
        id: 'user-admin-samuel',
        name: 'Samuel (Administrator)',
        email: 'sameduhub2025@gmail.com',
        role: 'admin',
        phone: '+234 903 448 6697',
        joinedDate: 'Jan 10, 2025',
      };
      setCurrentUser(adminUser);
      setUsersList((prev) => {
        const exists = prev.some((u) => u.email.toLowerCase() === cleanEmail);
        return exists
          ? prev.map((u) => (u.email.toLowerCase() === cleanEmail ? { ...u, role: 'admin' as const } : u))
          : [adminUser, ...prev];
      });
      showToast('Signed in as Administrator.', 'success');
      return { success: true, message: 'Signed in as Administrator.', isAdmin: true };
    }

    // 2. Customer accounts: attempt direct Firebase Authentication
    try {
      const fbRes = await loginWithFirebaseAuth(cleanEmail, pass);
      if (fbRes.success && fbRes.user) {
        setCurrentUser(fbRes.user);
        setUsersList((prev) => {
          const idx = prev.findIndex((u) => u.email.toLowerCase() === cleanEmail);
          if (idx >= 0) {
            return prev.map((u, i) => (i === idx ? fbRes.user! : u));
          }
          return [fbRes.user!, ...prev];
        });
        showToast(fbRes.message, 'success');
        return { success: true, message: fbRes.message, isAdmin: fbRes.isAdmin };
      }

      if (fbRes.message.includes('Invalid email or password')) {
        return { success: false, message: fbRes.message };
      }
    } catch (fbErr: any) {
      console.warn('Firebase Auth invocation warning:', fbErr);
    }

    const found = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'No registered user found with that email address.' };
    }

    if (found.password && found.password !== pass) {
      return { success: false, message: 'Invalid password. Please check and try again.' };
    }

    setCurrentUser(found);
    showToast(`Signed in successfully as ${found.name}`, 'success');
    return { success: true, message: 'Signed in successfully', isAdmin: found.role === 'admin' };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string; isAdmin?: boolean }> => {
    const res = await loginWithFirebaseGoogle();
    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast(res.message, 'success');
      return { success: true, message: res.message, isAdmin: res.isAdmin };
    }
    showToast(res.message, 'error');
    return { success: false, message: res.message };
  };

  const createFirebaseAdmin = async (email: string, pass: string) => {
    const res = await createAdminInFirebaseAuth(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast(res.message, 'success');
      return { success: true, message: res.message };
    }
    showToast(res.message, 'error');
    return { success: false, message: res.message };
  };

  const signup = (name: string, email: string, pass: string, phone?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'customer',
      phone: phone?.trim() || '+1 (555) 000-0000',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      password: pass,
    };

    setUsersList((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Welcome to NovaMobile, ${newUser.name}!`, 'success');
    return { success: true, message: 'Account registered successfully!' };
  };

  const loginAsAdminDemo = () => {
    const adminUser =
      usersList.find((u) => u.email.toLowerCase() === 'sameduhub2025@gmail.com') ||
      usersList.find((u) => u.role === 'admin') ||
      INITIAL_USERS[0];
    setCurrentUser(adminUser);
    showToast(`Switched to Administrator clearance (${adminUser.name})`, 'success');
  };

  const logout = async () => {
    await logoutFirebaseAuth();
    setCurrentUser(null);
    showToast('Signed out of NovaMobile', 'info');
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    showToast('Updated user role', 'info');
  };

  const deleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      showToast('Cannot delete currently active user', 'warning');
      return;
    }
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    showToast('User account deleted', 'info');
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string; sentEmail?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
      const fbRes = await sendFirebasePasswordReset(cleanEmail);
      if (fbRes.success) {
        showToast(fbRes.message, 'success');
        return { success: true, message: fbRes.message, sentEmail: true };
      }
      return { success: false, message: fbRes.message };
    } catch (e: any) {
      console.warn('Firebase password reset dispatch note:', e);
      return {
        success: false,
        message: e?.message || 'Unable to send password reset email. Please try again later.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        usersList,
        login,
        loginWithGoogle,
        createFirebaseAdmin,
        signup,
        logout,
        updateUserRole,
        deleteUser,
        loginAsAdminDemo,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

