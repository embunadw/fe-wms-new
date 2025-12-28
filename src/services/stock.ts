import api from "@/lib/axios";
import type { Stock } from "@/types";

export async function getAllStocks(): Promise<Stock[]> {
  const res = await api.get("/stock");
  return res.data.data;
}
export async function saveStock(data: {
  part_id: number;
  stk_location: string;
  stk_qty: number;
  stk_min: number;
  stk_max: number;
}) {
  const res = await api.post("/stock", data);
  return res.data;
}

