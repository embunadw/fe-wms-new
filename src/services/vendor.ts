import api from "@/lib/axios";
import type { MasterVendor } from "@/types";
import { getCurrentUser } from "@/services/auth";

/**
 * CREATE
 */
export async function createMasterVendor(data: MasterVendor) {
  return api.post("/vendors", data);
}


/**
 * READ (LIST)
 */
export async function getMasterVendors(): Promise<MasterVendor[]> {
  const res = await api.get("/vendors");

  return res.data.data.map((item: any) => ({
    vendor_id: item.id,
    vendor_no: item.vendor_no,
    vendor_name: item.vendor_name,
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
export async function getMasterVendorById(
  vendor_id: number
): Promise<MasterVendor> {
  const res = await api.get(`/vendors/${vendor_id}`);

  const item = res.data;

  return {
    vendor_id: item.id,
    vendor_no: item.vendor_no,
    vendor_name: item.vendor_name,
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
export async function updateMasterVendor(
  vendor_id: number,
  payload: {
    vendor_no: string;
    vendor_name: string;
    telephone?: string;
    contact_name?: string;
  }
): Promise<boolean> {
  const res = await api.put(`/vendors/${vendor_id}`, payload);
  return res.data !== null;
}

/**
 * DELETE
 */
export async function deleteMasterVendor(
  vendor_id: number
): Promise<boolean> {
  const res = await api.delete(`/vendors/${vendor_id}`);
  return res.status === 200;
}

/**
 * SUSPEND / ACTIVATE
 */
export async function toggleMasterVendorStatus(
  vendor_id: number
): Promise<boolean> {
  const res = await api.put(`/vendors/${vendor_id}/toggle`);
  return res.data !== null;
}
