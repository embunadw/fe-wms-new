import api from "@/lib/axios";
import type { DashboardResponse } from "@/types";

export async function getDashboardData(): Promise<DashboardResponse> {
  const res = await api.get("/dashboard");
  return res.data as DashboardResponse;
}

