import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { getFirebaseClients } from "./firebase";

export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: unknown;
  // Added for Firestore rules compliance; set internally when saving
  source?: "contact";
};

export type IduSubmission = {
  name: string;
  email: string;
  wantsDailyUpdates: boolean;
  message?: string;
  createdAt?: unknown;
};

export async function saveContactSubmission(data: ContactSubmission) {
  const { db } = getFirebaseClients();
  const docRef = await addDoc(collection(db, "contact_submissions"), {
    ...data,
    source: "contact",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function saveIduSubmission(data: IduSubmission) {
  const { db } = getFirebaseClients();
  const docRef = await addDoc(collection(db, "idu_submissions"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export type IduSubscriber = {
  email: string;
  wantsDailyUpdates: boolean;
};

function parseWantsDailyUpdates(value: string | undefined | null): boolean {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return ["yes", "y", "true", "1", "si", "sí", "daily", "on"].includes(
    normalized
  );
}

export async function listIduSubscribers(): Promise<IduSubscriber[]> {
  const { db } = getFirebaseClients();
  const snapshot = await getDocs(collection(db, "idu_submissions"));
  return snapshot.docs
    .map((doc) => doc.data() as Record<string, unknown>)
    .filter((d) => Boolean(d?.email))
    .map((d) => {
      const wantsFromNewField =
        typeof d.wantsDailyUpdates === "boolean"
          ? (d.wantsDailyUpdates as boolean)
          : undefined;
      const wantsFromLegacySubject =
        typeof d.subject === "boolean" ? (d.subject as boolean) : undefined;
      const wantsFromMessage = parseWantsDailyUpdates(
        d.message as string | undefined | null
      );
      const wantsDailyUpdates =
        wantsFromNewField ?? wantsFromLegacySubject ?? wantsFromMessage;
      return {
        email: String(d.email as string),
        wantsDailyUpdates: Boolean(wantsDailyUpdates),
      };
    });
}
