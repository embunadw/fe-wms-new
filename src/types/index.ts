// src/types/index.ts

/* ==========================
   BASIC TYPES
========================== */

export type Timestamp = string;

/* ==========================
   USER
========================== */

export interface UserDb {
  id: string;
  email: string;
  nama: string;
  role: string;
  lokasi: string;
  email_verified: boolean;
  auth_provider: "local";
  image_url: string | null;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  status?: "active" | "inactive";
}

export interface UserComplete {
  id: string;
  email: string;
  nama: string;
  role: string;
  lokasi: string;
  email_verified: boolean;
  auth_provider: "local";
  image_url: string | null;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

/* ==========================
   MASTER PART & STOCK
========================== */

export interface MasterPart {
  part_id?: string;
  part_number: string;
  part_name: string;
  part_satuan: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Stock {
  stk_id?: string;
  part_id: string;
  part_number: string;
  part_name: string;
  part_satuan: string;
  stk_location: string;
  stk_qty: number;
  stk_min: number;
  stk_max: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  barang?: MasterPart;
}

/* ==========================
   MATERIAL REQUEST (MR)
========================== */

export interface MRItem {
  part_id: string;
  part_number: string;
  part_name: string;
  satuan: string;
  priority: string;
  qty: number;
  qty_delivered: number;
}

export interface MR {
  id?: string;
  kode: string;
  tanggal_mr: string;
  due_date: string;
  lokasi: string;
  pic: string;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  barang: MRItem[];
}
/* ==========================
   MR RECEIVE (API RESPONSE)
========================== */

export interface MRDetail {
  dtl_mr_id?: string;
  mr_id?: string;
  part_id?: string;
  dtl_mr_part_number: string;
  dtl_mr_part_name: string;
  dtl_mr_satuan: string;
  dtl_mr_prioritas: string;
  dtl_mr_qty_request: number;
  dtl_mr_qty_received: number;
}

export interface MRReceive {
  mr_id?: string;
  mr_kode: string;
  mr_lokasi: string;
  mr_pic: string;
  mr_tanggal: string;
  mr_due_date: string;
  mr_status: string;
  created_at: string;
  updated_at: string;
  details: MRDetail[];
}

/* ==========================
   PURCHASE REQUEST (PR)
========================== */

export interface PRItem {
  part_id: number;
  part_number: string;
  part_name: string;
  satuan: string;
  mr_id: number;
  kode_mr: string;
  qty: number;
}

export interface PR {
  id?: string;
  kode: string;
  status: string;
  lokasi: string;
  pic: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  order_item: PRItem[]; // <-- Pastikan backend mengirim ini
  mrs: string[];
}


/* ==========================
   PURCHASE ORDER (PO)
========================== */

export interface PO {
  id?: string;
  kode: string;
  kode_pr: string;
  tanggal_estimasi: string;
  status: string;
  pic: string;
  keterangan?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/* ==========================
   DELIVERY
========================== */

export interface DeliveryItem {
  part_id: number;
  part_number: string;
  part_name: string;
  satuan: string;
  qty: number;
  qty_pending: number;
  qty_on_delivery: number;
  qty_delivered: number;
}

export interface Delivery {
  id?: string;
  kode_it: string;
  kode_mr: string;
  ekspedisi: string;
  resi_pengiriman: string;
  status: string;
  dari_gudang: string;
  ke_gudang: string;
  tanggal_pengiriman?: Timestamp;
  pic: string;
  jumlah_koli: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  items: DeliveryItem[];
}

/* ==========================
   RECEIVE & DASHBOARD
========================== */

export interface DashboardSummary {
  total_stock: number;
  stock_min_warning: number;
  total_mr: number;
  mr_pending: number;
  total_delivery: number;
  total_receive: number;
}

export interface DashboardDetails {
  stock_warning: any[];
  latest_mr: any[];
  latest_delivery: any[];
  latest_receive: any[];
}

export interface DashboardResponse {
  status: boolean;
  summary: DashboardSummary;
  details: DashboardDetails;
}
// ================= MASTER PART =================

export interface MasterPart {
  id: number;
  part_number: string;
  part_name: string;
  part_satuan: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payload CREATE
 * ⛔ TANPA id, created_at, updated_at
 */
export interface CreateMasterPartPayload {
  part_number: string;
  part_name: string;
  part_satuan: string;
}
