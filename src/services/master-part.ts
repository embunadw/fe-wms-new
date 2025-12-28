import api from "@/lib/axios";
import axios from "@/lib/axios";
import type { MasterPart } from "@/types";
import { getCurrentUser } from "@/services/auth";

 const user = await getCurrentUser();

export async function createMasterPart(
  data: MasterPart
): Promise<boolean> {
  const payload = {
    part_number: data.part_number,
    part_name: data.part_name,
    part_satuan: data.part_satuan,
    lokasi: user?.lokasi,
  };

  const res = await api.post("/barang", payload);
  return res.data.status === true;
}


export async function getMasterParts(): Promise<MasterPart[]> {
  const res = await api.get("/barang");

  return res.data.data.map((item: any) => ({
    part_id: item.part_id,
    part_number: item.part_number,
    part_name: item.part_name,
    part_satuan: item.part_satuan,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

export async function updateMasterPart(
  part_id: number,
  payload: {
    part_number: string;
    part_name: string;
    part_satuan: string;
  }
) {
  const res = await axios.put(`/barang/${part_id}`, payload);
  return res.data;
}

