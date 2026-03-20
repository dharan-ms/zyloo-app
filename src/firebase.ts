// purpose: firebase initialization and firestore CRUD operations for saved components

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import type { ComponentDocument } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

const isConfigured = Object.values(firebaseConfig).every(Boolean);
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

const COLLECTION_NAME = 'components';

export const isFirebaseConfigured = (): boolean => isConfigured;

export const saveComponent = async (
  prompt: string,
  code: string,
  title: string,
): Promise<ComponentDocument> => {
  if (!db) throw new Error('Firebase is not configured');
  const data = { prompt, code, title, createdAt: Date.now() };
  const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
  return { id: docRef.id, ...data };
};

export const listComponents = async (): Promise<ComponentDocument[]> => {
  if (!db) throw new Error('Firebase is not configured');
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ComponentDocument[];
};

export const deleteComponent = async (id: string): Promise<void> => {
  if (!db) throw new Error('Firebase is not configured');
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
