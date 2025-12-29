import api from "@/lib/axios";
import type { MasterPart, CreateMasterPartPayload } from "@/types";
import { getCurrentUser } from "@/services/auth";

/* ================= CREATE ================= */
export async function createMasterPart(
  payload: CreateMasterPartPayload
): Promise<boolean> {
  const user = await getCurrentUser();

  const body = {
    part_number: payload.part_number,
    part_name: payload.part_name,
    part_satuan: payload.part_satuan,
    lokasi: user?.lokasi,
  };

  const res = await api.post("/barang", body);
  return res.data.status === true;
}

/* ================= GET ================= */
export async function getMasterParts(): Promise<MasterPart[]> {
  const res = await api.get("/barang");

  return res.data.data.map((item: any) => ({
    id: item.part_id,
    part_number: item.part_number,
    part_name: item.part_name,
    part_satuan: item.part_satuan,
    lokasi: item.lokasi,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

/* ================= UPDATE ================= */
export async function updateMasterPart(
  part_id: number,
  payload: {
    part_number: string;
    part_name: string;
    part_satuan: string;
  }
) {
  const res = await api.put(`/barang/${part_id}`, payload);
  return res.data;
}
