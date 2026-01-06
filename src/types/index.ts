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


export interface MRItem {
  part_id: string;
  part_number: string;
  part_name: string;
  satuan: string;
  priority: string;
  qty: number;
  qty_delivered: number;
}


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
  order_item: PRItem[]; 
  mrs: string[];
}

export interface PO {
  po_id?: string;
  po_kode: string;
  pr_id?: string;
  po_tanggal: string;
  po_estimasi: string;
  po_status: string;
  po_pic: string;
  po_keterangan?: string;
  created_at: string;
  updated_at: string;
  details: PODetail[];
}


export interface PODetail {
  po_id?: string;
  part_id?: string;
  dtl_po_part_number: string;
  dtl_po_part_name: string;
  dtl_po_satuan: string;
  dtl_po_qty: number;
  dtl_qty_received?: number;
}


//Diyah Edit
export interface Stock {
  stk_id?: string;
  part_number: string;
  part_name: string;
  part_satuan: string;
  part_id: string;
  stk_location: string;
  stk_qty: number;
  stk_min: number;
  stk_max: number;
  created_at: Timestamp;
  updated_at: Timestamp;

  barang: MasterPart;
}

export interface MasterPart {
  part_id?: string;
  part_number: string;
  part_name: string;
  part_satuan: string;
  created_at: string;
  updated_at: string;
}

export interface Pic {
  id?: string;
  nama: string;
  email: string;
  role: string;
  lokasi: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PurchaseRequest {
  pr_id?: string;
  pr_kode: string;
  pr_lokasi: string;
  pr_tanggal: string;
  pr_status: string;
  pr_pic: string;
  created_at: string;
  updated_at: string;
  details: PRItemReceive[];
}

export interface POReceive {
  po_id?: string;
  po_kode: string;
  pr_id: string;
  po_tanggal: string;
  po_estimasi: string;
  po_keterangan: string;
  po_pic: string | null;
  po_status: string;
  created_at: string;
  updated_at: string;
  purchase_request: PurchaseRequest;
  details: PODetail[]
}

export interface POHeader {
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

export interface RI {
  ri_id?: string;
  ri_kode: string;
  po_id: number;
  ri_lokasi: string;
  ri_tanggal: string;
  ri_keterangan: string;
  ri_pic: string | null;
  created_at: string;
  updated_at: string;
  purchase_order: POReceive;
  details: RIDetail[];
}

export interface RIDetail {
  dtl_ri_id?: string;
  ri_id: number;
  po_id: number;
  part_id: number;
  dtl_ri_part_number: string;
  dtl_ri_part_name: string;
  dtl_ri_satuan: string;
  dtl_ri_qty: number;
  created_at: string;
  updated_at: string;
  mr?: MRReceive;
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

export interface PRItemReceive {
  part_id?: string;
  pr_id?: string;
  dtl_pr_part_number: string;
  dtl_pr_part_name: string;
  dtl_pr_satuan: string;
  mr_id?: string;
  dtl_pr_qty: number;
  mr?: MRReceive;
}

export interface DeliveryReceive {
  dlv_id?: string;
  dlv_kode: string;
  mr_id?: string;
  dlv_dari_gudang: string;
  dlv_ke_gudang : string;
  dlv_ekspedisi: string;
  dlv_no_resi: string;
  dlv_jumlah_koli: number;
  dlv_status: string;
  dlv_pic: string;
  created_at: string;
  updated_at: string;
  details: DeliveryDetail[];
  mr?: MRReceive;
  
}

export interface DeliveryDetail {
  dtl_dlv_id?: string;
  dlv_id?: string;
  part_id?: string;
  dtl_dlv_part_number: string;
  dtl_dlv_part_name: string;
  dtl_dlv_satuan: string;
  qty: number;
  qty_delivered: number;
  qty_on_delivery: number;
  qty_pending: number;
  created_at: string;
  updated_at: string;
}

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

export interface UpdatePOPayload {
  po_status: "pending" | "purchased";
  po_keterangan?: string;
}

