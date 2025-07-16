
'use client';

import { 
  useState, 
  useEffect, 
  createContext, 
  useContext, 
  ReactNode 
} from 'react';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  type Auth,
} from 'firebase/auth';
import { app, googleProvider, githubProvider } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authInstance = getAuth(app);
    setAuth(authInstance);

    setPersistence(authInstance, browserLocalPersistence).then(() => {
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
    }).catch((error) => {
        console.error("Firebase persistence error:", error);
        setLoading(false);
    });
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!auth) return;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
      setUser({ ...userCredential.user, displayName });
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    router.push('/login'); 
  };
  
  const signInWithGoogle = async () => {
    if (!auth) return;
    await signInWithPopup(auth, googleProvider);
  };
  
  const signInWithGitHub = async () => {
    if (!auth) return;
    await signInWithPopup(auth, githubProvider);
  };

  const value = { user, loading, signUp, signIn, signOut, signInWithGoogle, signInWithGitHub };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
