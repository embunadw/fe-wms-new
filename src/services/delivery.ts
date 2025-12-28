import axios from "axios";
import api from "@/lib/axios";
import type { DeliveryReceive } from "@/types"; 

const BASE_URL = "http://localhost:8000/api/deliveries"; 


export async function getAllDelivery(): Promise<DeliveryReceive[]> {
  const res = await api.get("/deliveries");
  return res.data;
}

export async function getDeliveryByKode(dlv_kode: string): Promise<DeliveryReceive | null> {
  try {
    const res = await axios.get(
      `${BASE_URL}/kode/${encodeURIComponent(dlv_kode)}`
    );

    return res.data ?? null;

  } catch (error: any) {

    if (error.response?.status === 404) return null;

    console.error("Error fetching delivery by kode:", error);
    throw new Error("Failed to fetch delivery by kode");
  }
}

export async function createDelivery(data: DeliveryReceive) {

  const payload = {
    dlv_kode: data.dlv_kode,
    dlv_ekspedisi: data.dlv_ekspedisi,
    dlv_dari_gudang: data.dlv_dari_gudang,
    dlv_ke_gudang: data.dlv_ke_gudang,
    dlv_status: data.dlv_status,
    dlv_pic: data.dlv_pic,
    dlv_no_resi: data.dlv_no_resi,
    dlv_jumlah_koli: data.dlv_jumlah_koli,
    mr_id: data.mr_id,
    created_at: data.created_at,
    updated_at: data.updated_at,

    details: data.details.map((d) => ({
      part_id: d.part_id,
      dtl_dlv_part_number: d.dtl_dlv_part_number,
      dtl_dlv_part_name: d.dtl_dlv_part_name,
      dtl_dlv_satuan: d.dtl_dlv_satuan,
      qty: d.qty,
      qty_pending: d.qty_pending,
      qty_on_delivery: d.qty_on_delivery,
      qty_delivered: d.qty_delivered,
      created_at: d.created_at,
      updated_at: d.updated_at,
    })),
  };

  return api.post("/deliveries", payload);
}

export async function updateDelivery(kode_it: string, data: any): Promise<boolean> {
  try {
    await api.patch(`/deliveries/kode/${encodeURIComponent(kode_it)}/status`, data);
    return true;
  } catch (error: any) {
    console.error("Error updating delivery:", error);
    throw new Error(error.response?.data?.message ?? "Failed to update delivery");
  }
}

export async function update(
  dlv_kode: string,
  payload: {
    dlv_ekspedisi: string;
    dlv_no_resi: string;
    dlv_jumlah_koli: number;
  }
) {
  const res = await axios.put(
    `${BASE_URL}/kode/${encodeURIComponent(dlv_kode)}`
    , payload);
  return res.data;
}

