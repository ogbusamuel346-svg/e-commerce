export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  joinedDate: string;
  password?: string; // stored for demo simulation
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
