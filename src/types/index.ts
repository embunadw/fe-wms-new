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

// export interface MRReceive {
//   mr_id?: string;
//   mr_kode: string;
//   mr_lokasi: string;
//   mr_pic: string;
//   mr_tanggal: string;
//   mr_due_date: string;
//   mr_status: string;
//   created_at: string;
//   updated_at: string;
//   details: MRDetail[];
// }

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

export interface Part {
  part_id: string;
  part_number: string;
  part_name: string;
  part_satuan: string;
  created_at: string;
  updated_at: string;
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
  signed_penerima_name?: string | null;
  signed_penerima_sign?: string | null;
  signed_penerima_at?: string | null;
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

// export interface MRReceive {
//   mr_id?: string;
//   mr_kode: string;
//   mr_lokasi: string;
//   mr_pic: string;
//   mr_tanggal: string;
//   mr_due_date: string;
//   mr_status: string;
//   created_at: string;
//   updated_at: string;
//   details: MRDetail[];
// }

export interface UpdateMRItemPayload {
  dtl_mr_id: string;
  part_id: string;
  dtl_mr_part_number: string;
  dtl_mr_part_name: string;
  dtl_mr_satuan: string;
  dtl_mr_prioritas: string;
  dtl_mr_qty_request: number;
}

export type MRStatus = "open" | "partial" | "closed";

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
export interface UpdateMRStatusPayload {
  mr_status: MRStatus;
}

export interface MRReceive {
  mr_id?: string;
  mr_kode: string;
  mr_lokasi: string;
  mr_pic: string;
  mr_tanggal: string;
  mr_due_date: string;
  mr_status: MRStatus;

  // 🔥 audit dari BE
  mr_last_edit_at?: string | null;
  mr_last_edit_by?: string | null;

  created_at: string;
  updated_at: string;
  details: MRDetail[];

    // ✅ TAMBAHAN SIGNATURE
  signature_url?: string | null;
  sign_at?: string | null;
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

  signed_pengirim_name?: string | null;
  signed_pengirim_sign?: string | null;
  signed_pengirim_at?: string | null;

  signed_logistik_name?: string | null;
  signed_logistik_sign?: string | null;
  signed_logistik_at?: string | null;

  signed_penerima_name?: string | null;
  signed_penerima_sign?: string | null;
  signed_penerima_at?: string | null;
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
  receive_note?: string;
  qty_delivered: number;
  qty_on_delivery: number;
  qty_pending: number;
  created_at: string;
  updated_at: string;
}

// export interface MRDetail {
//   dtl_mr_id?: string;
//   mr_id?: string;
//   part_id?: string;
//   dtl_mr_part_number: string;
//   dtl_mr_part_name: string;
//   dtl_mr_satuan: string;
//   dtl_mr_prioritas: string;
//   dtl_mr_qty_request: number;
//   dtl_mr_qty_received: number;
// }

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

export interface SpbReport {
  spb_id: number;
  spb_no: string;
  spb_tanggal: string;

  spb_no_wo?: string;
  spb_section?: string;
  spb_pic_gmi?: string;
  spb_pic_ppa?: string;

  part_id: string;
  dtl_spb_part_satuan: string;
  dtl_spb_part_name : string;
  dtl_spb_part_number : string;
  dtl_spb_qty : number;

  spb_kode_unit?: string;
  spb_tipe_unit?: string;
  spb_brand?: string;
  spb_hm?: number;
  spb_problem_remark?: string;

  spb_status: string;
  created_at?: string;

  po_no?: string | null;
  so_no?: string | null;
  po_created_at?: string | null;

  do_no?: string | null;
  do_status_part?: string | null;
  do_created_at?: string | null;

  invoice_no?: string | null;
  invoice_date?: string | null;
  invoice_email_date?: string | null;
  invoice_created_at?: string | null;
}

export interface SpbCreate {
  spb_no: string;
  spb_tanggal: string;
  spb_no_wo?: string;
  spb_section?: string;
  spb_pic_gmi?: string;
  spb_pic_ppa?: string;
  spb_kode_unit?: string;
  spb_tipe_unit?: string;
  spb_brand?: string;
  spb_hm?: number;
  spb_problem_remark?: string;
  spb_gudang?: string;
  spb_status?: string;
  created_at?: string;
  updated_at?: string;
  details: SpbDetail[];
  po?: SpbPo;
  do?: SpbDo;
  invoice?: SpbInvoice;
}

export interface Spb {
  spb_id: number;
  spb_no: string;
  spb_tanggal: string;
  spb_no_wo?: string;
  spb_section?: string;
  spb_pic_gmi?: string;
  spb_pic_ppa?: string;
  spb_kode_unit?: string;
  spb_tipe_unit?: string;
  spb_brand?: string;
  spb_hm?: number;
  spb_problem_remark?: string;
  spb_gudang?: string;
  spb_status?: string;
  created_at?: string;
  updated_at?: string;
  details: SpbDetail[];
  po?: SpbPo;
  do?: SpbDo;
  invoice?: SpbInvoice;
}

export interface SpbDetail{
  spb_detail_id: number;
  spb_id: number;
  part_id?: string;
  dtl_spb_part_number: string;
  dtl_spb_part_name: string;
  dtl_spb_part_satuan: string;
  dtl_spb_qty: number;
  created_at?: string;
  updated_at?: string;
}

export interface SpbPo {
  spb_po_id: number;
  spb_id: number;
  po_no: string;
  so_no?: string;
  so_date?: string;
  created_at?: string;
  updated_at?: string;
  spb?:Spb;
}


export interface SpbDo {
  spb_do_id: number;
  spb_id: number;
  do_no: string;
  do_date?: string;
  do_status_part?: string;
  created_at?: string;
  updated_at?: string;
  spb?: Spb;
}

export interface SpbInvoice {
  spb_invoice_id: string;
  spb_id: string;

  invoice_no: string;
  invoice_date?: string;
  invoice_email_date?: string;

  created_at?: string;
  updated_at?: string;
  spb?:Spb;
}


