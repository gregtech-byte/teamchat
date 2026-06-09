import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

interface AuthUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

interface AuthContextValue {
  currentUser: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  logIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? 'Unknown',
          photoURL: user.photoURL ?? undefined,
        })
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function signUp(email: string, password: string, name: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      name,
      email,
      avatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      status: 'online',
      createdAt: serverTimestamp(),
    })
  }

  async function logIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logOut() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
