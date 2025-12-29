/**
 * TODO
 * 1. Create PO : Purchasing, Warehouse
 * 2. Update PO : Purchasing, Warehouse
 * 3. Get all PO : All
 * 4. Get PO by kode : All
 */

import api from "@/lib/axios";
import type { PO } from "@/types";

/* ===================== GET ALL PO ===================== */
export async function getAllPo(): Promise<PO[]> {
  const res = await api.get("/po");
  return res.data.data as PO[];
}

/* ===================== GET PO BY KODE ===================== */
export async function getPoByKode(kode: string): Promise<PO | null> {
  const res = await api.get(`/po/${kode}`);
  return res.data?.data ?? null;
}

/* ===================== CREATE PO ===================== */
export async function createPO(
  payload: Omit<PO, "id" | "created_at" | "updated_at">
): Promise<boolean> {
  const res = await api.post("/po", payload);
  return res.data.status === true;
}

/* ===================== UPDATE PO ===================== */
export async function updatePO(
  id: number,
  payload: Partial<Omit<PO, "id" | "created_at">>
): Promise<boolean> {
  const res = await api.put(`/po/${id}`, payload);
  return res.data.status === true;
}
