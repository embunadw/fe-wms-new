import { db } from "@/lib/firebase";
import type { UserDb } from "@/types";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const userRef = collection(db, "users");

export async function getAllUsers({} = {}): Promise<UserDb[]> {
  try {
    const q = query(userRef, orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserDb[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}


export async function updateUser(user: Partial<UserDb>): Promise<boolean> {
  try {
    const docRef = doc(db, "users", user.id!);
    await updateDoc(docRef, {
      nama: user.nama,
      role: user.role,
      lokasi: user.lokasi,
      updated_at: serverTimestamp(),
    } as Partial<UserDb>);
    return true;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`);
    } else {
      throw new Error("Failed to update user due to an unexpected error.");
    }
  }
}
