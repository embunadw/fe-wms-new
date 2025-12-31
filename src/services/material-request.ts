/**
 * MR SERVICE (BACKEND)
 *
 * 1. Generate MR Code : Backend
 * 2. Create MR        : Backend
 * 3. Get all MR       : All (TIDAK DIUBAH)
 * 4. Get MR by kode   : All
 */

import type { MRReceive } from "@/types";
import api from "@/lib/axios";

const BASE_URL = "http://localhost:8000/api/mr";

export async function generateKodeMR(lokasi: string): Promise<string> {
  const res = await api.get(
    `${BASE_URL}/generate-kode`,
    { params: { lokasi } }
  );

  return res.data; 
}

export async function getOpenMR() {
  const res = await api.get( `${BASE_URL}/open`);
  return res.data;
}


export async function createMR(data: MRReceive) {
  const payload = {
    mr_kode: data.mr_kode,
    mr_tanggal: data.mr_tanggal,
    mr_due_date: data.mr_due_date,
    mr_lokasi: data.mr_lokasi,
    mr_pic: data.mr_pic,
    mr_status: data.mr_status,
    created_at: data.created_at,
    updated_at: data.updated_at,

    details: data.details.map((d) => ({
      part_id: d.part_id,
      dtl_mr_part_number: d.dtl_mr_part_number,
      dtl_mr_part_name: d.dtl_mr_part_name,
      dtl_mr_satuan: d.dtl_mr_satuan,
      dtl_mr_prioritas: d.dtl_mr_prioritas,
      dtl_mr_qty_request: d.dtl_mr_qty_request ?? 0,
      dtl_mr_qty_received: d.dtl_mr_qty_received ?? 0,
    })),
  };

  return api.post("/mr", payload);
}

export async function getAllMr(): Promise<MRReceive[]> {
  const res = await api.get("/mr");
  return res.data;
}

export async function getMrByKode(
  mr_kode: string
): Promise<MRReceive | null> {
  try {
    const res = await api.get(
      `${BASE_URL}/kode/${encodeURIComponent(mr_kode)}`
    );

    return res.data ?? null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error("Error fetching MR by kode:", error);
    throw new Error("Failed to fetch MR by kode");
  }
}


