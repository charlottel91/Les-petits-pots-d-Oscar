import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { useStorageState } from '@/hooks/useStorageState';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  session: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setSession(user && user.uid);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setSession(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, session }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
