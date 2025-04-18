"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  type Auth,
} from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { useRouter } from "next/navigation"

// Firebase configuration
const firebaseConfig = {
  // Use environment variables or fallback to demo values for testing
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key-for-testing-only",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-domain.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-bucket.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890abcdef",
}

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;

// Only initialize if apps haven't been initialized yet and if we're in a browser environment
if (typeof window !== "undefined" && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else if (getApps().length > 0) {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

// Mock user for demo purposes
const createMockUser = (email: string): any => {
  return {
    uid: "demo-user-id",
    email: email,
    emailVerified: true,
    isAnonymous: false,
    displayName: email.split('@')[0],
    providerId: 'demo',
    refreshToken: 'mock-refresh-token',
    metadata: {
      creationTime: Date.now().toString(),
      lastSignInTime: Date.now().toString()
    },
    providerData: [],
    phoneNumber: null,
    photoURL: null,
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'demo-token',
    getIdTokenResult: async () => ({
      token: 'demo-token',
      signInProvider: 'demo',
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      authTime: new Date().toISOString(),
      claims: {}
    }),
    reload: async () => {},
    toJSON: () => ({})
  } as unknown as User;
};

type UserRole = "doctor" | "health_worker" | null
type UserData = {
  user: User | null
  role: UserRole
  isLoading: boolean
}

interface FirebaseContextType {
  userData: UserData
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, role: UserRole) => Promise<void>
  signOut: () => Promise<void>
  setUserRole: (role: UserRole) => void
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    user: null,
    role: null,
    isLoading: true,
  })
  const router = useRouter()

  useEffect(() => {
    // Check if we have a stored demo login
    if (typeof window !== 'undefined') {
      const demoLoggedIn = localStorage.getItem("demoLoggedIn");
      
      if (demoLoggedIn === "true") {
        const email = localStorage.getItem("demoEmail") || "demo@ruralcare.org";
        const role = (localStorage.getItem("userRole") as UserRole) || "doctor";
        
        // Create a mock user for demo purposes
        const mockUser = createMockUser(email);
        
        setUserData({ user: mockUser, role, isLoading: false });
        return;
      }
    }

    // Real Firebase auth handling
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // For demo purposes, we'll get the role from localStorage
          // In a real app, you would fetch this from Firestore
          const role = (localStorage.getItem("userRole") as UserRole) || "doctor"
          setUserData({ user, role, isLoading: false })
        } else {
          setUserData({ user: null, role: null, isLoading: false })
        }
      });
      
      return () => unsubscribe();
    } else {
      // No Firebase auth available, set loading to false
      setUserData(prev => ({ ...prev, isLoading: false }));
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Special case for demo account
      if (email === "demo@ruralcare.org") {
        console.log("Using demo account login");
        localStorage.setItem("demoLoggedIn", "true");
        localStorage.setItem("demoEmail", email);
        localStorage.setItem("userRole", "doctor");
        
        // Create a mock user for demo purposes
        const mockUser = createMockUser(email);
        
        setUserData({ user: mockUser, role: "doctor", isLoading: false });
        router.push("/dashboard");
        return;
      }

      // Regular Firebase auth
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        // No Firebase auth, use demo mode
        localStorage.setItem("demoLoggedIn", "true");
        localStorage.setItem("demoEmail", email);
        localStorage.setItem("userRole", "doctor");
        
        const mockUser = createMockUser(email);
        setUserData({ user: mockUser, role: "doctor", isLoading: false });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  const signInWithGoogle = async () => {
    try {
      if (auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        localStorage.setItem("userRole", "doctor");
        setUserData({ user, role: "doctor", isLoading: false });
        router.push("/dashboard");
      } else {
        // Mock Google sign in for demo
        const mockEmail = "google-user@gmail.com";
        localStorage.setItem("demoLoggedIn", "true");
        localStorage.setItem("demoEmail", mockEmail);
        localStorage.setItem("userRole", "doctor");
        
        const mockUser = createMockUser(mockEmail);
        mockUser.displayName = "Google User";
        mockUser.photoURL = "https://ui-avatars.com/api/?name=Google+User&background=random";
        
        setUserData({ user: mockUser, role: "doctor", isLoading: false });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      // Regular Firebase auth
      if (auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem("userRole", role || "doctor");
        setUserData({ user: userCredential.user, role, isLoading: false });
        router.push("/dashboard");
      } else {
        // No Firebase auth, use demo mode
        localStorage.setItem("demoLoggedIn", "true");
        localStorage.setItem("demoEmail", email);
        localStorage.setItem("userRole", role || "doctor");
        
        const mockUser = createMockUser(email);
        setUserData({ user: mockUser, role, isLoading: false });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  const signOut = async () => {
    try {
      // Demo logout logic
      localStorage.removeItem("demoLoggedIn");
      localStorage.removeItem("demoEmail");
      localStorage.removeItem("userRole");
      
      // Real Firebase logout if available
      if (auth && auth.currentUser) {
        await firebaseSignOut(auth);
      }
      
      setUserData({ user: null, role: null, isLoading: false });
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  const setUserRole = (role: UserRole) => {
    localStorage.setItem("userRole", role || "doctor");
    setUserData((prev) => ({ ...prev, role }));
  }

  return (
    <FirebaseContext.Provider value={{ userData, signIn, signInWithGoogle, signUp, signOut, setUserRole }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export { db }
