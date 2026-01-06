import api from "@/lib/axios";
import type { PO, POHeader, POReceive, UpdatePOPayload } from "@/types";

const BASE_URL = "http://localhost:8000/api/po";

/**
 * ROLE
 * - Create PO : Purchasing, Warehouse
 * - Update PO : Purchasing, Warehouse
 * - Get All PO : All
 * - Get PO By ID : All
 */


export async function getAllPo(): Promise<POReceive[]> {
  const res = await api.get("/po");

  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (Array.isArray(res.data?.data)) {
    return res.data.data;
  }

  console.error("Unexpected PO response shape:", res.data);
  return [];
}

export async function getPo(): Promise<POHeader[]> {
  const res = await api.get("/po");

  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (Array.isArray(res.data?.data)) {
    return res.data.data;
  }

  console.error("Unexpected PO response shape:", res.data);
  return [];
}

export async function getPoByKode(
  po_kode: string
): Promise<POReceive | null> {
  try {
    const res = await api.get(
      `${BASE_URL}/kode/${encodeURIComponent(po_kode)}`
    );

    return res.data ?? null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error("Error fetching PR by kode:", error);
    throw new Error("Failed to fetch PR by kode");
  }
}

export async function getPoById(po_id: number): Promise<PO | null> {
  try {
    const res = await api.get(`${BASE_URL}/${po_id}`);
    return res.data ?? null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error("Error fetching PO by id:", error);
    throw new Error("Failed to fetch PO by id");
  }
}

export async function createPO(data: PO) {
  const payload = {
    po_kode: data.po_kode,
    pr_id: data.pr_id,
    po_tanggal: data.po_tanggal,
    po_estimasi: data.po_estimasi,
    po_keterangan: data.po_keterangan,
    po_status: data.po_status,
    po_pic: data.po_pic,

    details: data.details.map((d) => ({
      part_id: d.part_id,
      dtl_po_part_number: d.dtl_po_part_number,
      dtl_po_part_name: d.dtl_po_part_name,
      dtl_po_satuan: d.dtl_po_satuan,
      dtl_po_qty: d.dtl_po_qty,
    })),
  };

  return api.post("/po", payload);
}

export async function updatePO(
  po_id?: string,
  payload?: UpdatePOPayload
) {
  const res = await api.put(`/po/${po_id}`, payload);
  return res.data?.status === true;
}

