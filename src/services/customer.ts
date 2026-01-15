import api from "@/lib/axios";
import type { MasterCustomer } from "@/types";

/**
 * CREATE
 */
export async function createMasterCustomer(data: MasterCustomer) {
  return api.post("/customers", data);
}

/**
 * READ (LIST)
 */
export async function getMasterCustomers(): Promise<MasterCustomer[]> {
  const res = await api.get("/customers");

  return res.data.data.map((item: any) => ({
    customer_id: item.id,
    customer_no: item.customer_no,
    customer_name: item.customer_name,
    telephone: item.telephone,
    contact_name: item.contact_name,
    is_active: item.is_active,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

/**
 * READ (DETAIL)
 */
export async function getMasterCustomerById(
  customer_id: number
): Promise<MasterCustomer> {
  const res = await api.get(`/customers/${customer_id}`);
  const item = res.data;

  return {
    customer_id: item.id,
    customer_no: item.customer_no,
    customer_name: item.customer_name,
    telephone: item.telephone,
    contact_name: item.contact_name,
    is_active: item.is_active,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

/**
 * UPDATE
 */
export async function updateMasterCustomer(
  customer_id: number,
  payload: {
    customer_no: string;
    customer_name: string;
    telephone?: string;
    contact_name?: string;
  }
): Promise<boolean> {
  const res = await api.put(`/customers/${customer_id}`, payload);
  return res.data !== null;
}

/**
 * SUSPEND / ACTIVATE
 */
export async function toggleMasterCustomerStatus(
  customer_id: number
): Promise<boolean> {
  const res = await api.put(`/customers/${customer_id}/toggle`);
  return res.data !== null;
}
