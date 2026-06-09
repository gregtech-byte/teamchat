import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC35-9hfv-9jB8sD1rNqVVPYwW5Yk5lGfo",
  authDomain: "greg-tech-b92e6.firebaseapp.com",
  projectId: "greg-tech-b92e6",
  storageBucket: "greg-tech-b92e6.firebasestorage.app",
  messagingSenderId: "297998444581",
  appId: "1:297998444581:web:3b83dfb96c3997055777cc"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
