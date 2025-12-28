/**
 * TODO
 * 1. Create PR : Purchase, Warehouse
 * 2. Update PR : Purchase, Warehouse
 * 3. Get all PR : All
 * 4. Get PR by id : All
 */

import { PRCollection } from "@/lib/firebase";
import type { PurchaseRequest, PR } from "@/types";
import {
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import api from "@/lib/axios";

export async function getAllPr(): Promise<PR[]> {
  try {
    const q = query(PRCollection, orderBy("kode", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PR[];
  } catch (error) {
    console.error("Error fetching all PR:", error);
    throw error;
  }
}

//edited diyah
export async function getPrByKode(id: string): Promise<PurchaseRequest | null> {
  try {
    const res = await api.get(`/pr/${id}`);

    if (!res.data?.data) return null;

    return res.data.data as PurchaseRequest;
  } catch (error) {
    console.error(`Error fetching PR by ID ${id}:`, error);
    throw error;
  }
}

export async function createPR(
  newPRData: Omit<PR, "id" | "created_at" | "updated_at">
): Promise<boolean> {
  try {
    // check pr with same kode
    const q = query(PRCollection, where("kode", "==", newPRData.kode));
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      throw new Error(
        `MR PR kode ${newPRData.kode} sudah ada, ganti dengan yang lain.`
      );
    }

    const timestamp = Timestamp.now();
    const prToAdd = {
      ...newPRData,
      created_at: timestamp,
      updated_at: timestamp,
    };
    await addDoc(PRCollection, prToAdd);
    return true;
  } catch (error) {
    console.error("Error creating PR:", error);
    throw error;
  }
}
