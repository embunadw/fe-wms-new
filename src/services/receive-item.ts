import api from "@/lib/axios";
import type { POReceive, RI } from "@/types";

export async function getAllRi(): Promise<RI[]> {
  const res = await api.get("/receive");
  return res.data;
}

export async function getPurchasedPO(): Promise<POReceive[]> {
  const res = await api.get("/receive/purchase-orders");
  return res.data.data;
}

export async function getRIByKode(ri_kode: string): Promise<RI> {
  const res = await api.get(`/receive/kode/${encodeURIComponent(ri_kode)}`);
  return res.data;
}

export async function createRI(data: any): Promise<boolean> {
  const payload = {
    ri_kode: data.ri_kode,
    po_id: data.po_id,
    ri_lokasi: data.ri_lokasi,
    ri_tanggal: data.ri_tanggal,
    ri_keterangan: data.ri_keterangan,
    ri_pic: data.ri_pic,

    details: data.details.map((d: any) => ({
      part_id: d.part_id,
      mr_id: d.mr_id,
      dtl_ri_part_number: d.dtl_ri_part_number,
      dtl_ri_part_name: d.dtl_ri_part_name,
      dtl_ri_satuan: d.dtl_ri_satuan,
      dtl_ri_qty: d.dtl_ri_qty,
    })),
  };

  const res = await api.post("/receive", payload);
  return res.data.status === true;
}
