import api from "@/lib/axios";
import type { PR, PurchaseRequest } from "@/types";

/**
 * ROLE
 * - Create PR : Purchase, Warehouse
 * - Update PR : Purchase, Warehouse
 * - Get All PR : All
 * - Get PR By Kode : All
 */

/* ===================== GET ALL PR ===================== */
export async function getAllPr(): Promise<PR[]> {
  const res = await api.get("/pr");
  return res.data.data as PR[];
}

/* ===================== GET PR BY KODE ===================== */
export async function getPrByKode(kode: string): Promise<PurchaseRequest | null> {
  const res = await api.get(`/pr/${kode}`);

  // Jika API masih return array, ambil item pertama
  const data = res.data?.data;
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as PurchaseRequest;
  }

  return data ?? null;
}


/* ===================== CREATE PR ===================== */
export async function createPR(
  payload: Omit<PR, "id" | "created_at" | "updated_at">
): Promise<boolean> {
  const res = await api.post("/pr", payload);
  return res.data.status === true;
}

/* ===================== UPDATE PR ===================== */
export async function updatePR(
  id: number,
  payload: Partial<Omit<PR, "id" | "created_at">>
): Promise<boolean> {
  const res = await api.put(`/pr/${id}`, payload);
  return res.data.status === true;
}
