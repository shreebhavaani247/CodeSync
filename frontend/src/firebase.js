import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"; 
 
const firebaseConfig = { 
  apiKey: "AIzaSyDNXqUpO0vjQPFzBmqwxW1OVLdtkC6sCLQ", 
  authDomain: "codesync-v2.firebaseapp.com", 
  projectId: "codesync-v2", 
  storageBucket: "codesync-v2.firebasestorage.app", 
  messagingSenderId: "1073673021215", 
  appId: "1:1073673021215:web:450d2566430c421a12b22a" 
}; 
 
const app = initializeApp(firebaseConfig); 
export const db = getFirestore(app); 
