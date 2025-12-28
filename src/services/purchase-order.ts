/**
 * TODO
 * 1. Create PO : Purchasing, Warehouse
 * 2. Update PO : Purchasing, Warehouse
 * 3. Get all PO : All
 * 4. Get PO by id : All
 */
import { POCollection } from "@/lib/firebase"; // Assuming you have a POCollection similar to PRCollection
import type { PO, POReceive } from "@/types"; // Assuming your types are in "@/types"
import {
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  updateDoc,
} from "firebase/firestore";
import api from "@/lib/axios";

//edited diyah
export async function getAllPo(): Promise<POReceive[]> {
  try {
    const res = await api.get("/pr");
    return res.data.data as POReceive[];
  } catch (error) {
    console.error("Error fetching all PO:", error);
    throw error;
  }
}

export async function getPurchasedPO(): Promise<PO[]> {
  try {
    const q = query(
      POCollection,
      where("status", "==", "purchased"),
      orderBy("kode", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PO[];
  } catch (error) {
    console.error("Error fetching all PO:", error);
    throw error;
  }
}

export async function getPoByKode(kode: string): Promise<PO | null> {
  try {
    const q = query(POCollection, where("kode", "==", kode));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as PO; // Assuming PO also has an 'id' field for document ID
  } catch (error) {
    console.error(`Error fetching PO by kode ${kode}:`, error);
    throw error;
  }
}

export async function createPO(newPOData: PO): Promise<boolean> {
  try {
    // Check if PO with the same kode already exists
    const q = query(POCollection, where("kode", "==", newPOData.kode));
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      throw new Error(
        `PO kode ${newPOData.kode} already exists. Please use a different code.`
      );
    }

    const timestamp = Timestamp.now();
    const poToAdd = {
      ...newPOData,
      created_at: timestamp,
      updated_at: timestamp,
    };
    await addDoc(POCollection, poToAdd);
    return true;
  } catch (error) {
    console.error("Error creating PO:", error);
    throw error;
  }
}

export async function updatePO(data: PO): Promise<boolean> {
  try {
    const q = query(POCollection, where("kode", "==", data.kode));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      throw new Error(`PO with kode ${data.kode} not found.`);
    }
    const timestamp = Timestamp.now();
    await updateDoc(snapshot.docs[0].ref, {
      ...data,
      updated_at: timestamp,
    });
    return true;
  } catch (error) {
    console.error(`Error updating PO with Kode ${data.kode}:`, error);
    throw error;
  }
}
