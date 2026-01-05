import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type {POReceive,PurchaseRequest } from "@/types"; // Pastikan path ini benar
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner"; // Import toast for user feedback
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { formatTanggal } from "@/lib/utils";
import { getPrByKode } from "@/services/purchase-request";
import { getPoByKode } from "@/services/purchase-order";
// import { EditPODialog } from "@/components/dialog/edit-po";

export default function PurchaseOrderDetail() {
  const { kode } = useParams<{ kode: string }>();
  const [po, setPo] = useState<POReceive | null>(null);
  const [pr, setPr] = useState<PurchaseRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPODetail() {
      if (!kode) {
        toast.error("Kode Purchase Order tidak ditemukan di URL.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await getPoByKode(kode);
        console.log(res);
        if (res) {
          setPo(res);
        } else {
          toast.error(`Purchase Order dengan kode ${kode} tidak ditemukan.`);
          setPo(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail PO:", error);
        if (error instanceof Error) {
          toast.error(`Gagal mengambil detail PO: ${error.message}`);
        } else {
          toast.error(
            "Terjadi kesalahan saat mengambil detail Material Request."
          );
        }
        setPo(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPODetail();
  }, [kode, refresh]);

  // fetch pr data
  useEffect(() => {
    async function fetchPRData() {
      if (!po) return;
      try {
        const res = await getPrByKode(po.purchase_request.pr_kode);
        if (res) {
          setPr(res);
        } else {
          toast.error(`PR dengan kode ${po.purchase_request.pr_kode} tidak ditemukan.`);
          setPr(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data PR:", error);
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data PR: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data PR.");
        }
        setPr(null);
      }
    }
    fetchPRData();
  }, [po]);

  if (isLoading) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Purchase Order...</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Memuat data...
            </div>
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!po) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Purchase Order Tidak Ditemukan</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              PO dengan kode "{kode}" tidak ditemukan.
            </div>
          </SectionBody>
          <SectionFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Pastikan kode yang Anda masukkan benar.
            </p>
          </SectionFooter>
        </SectionContainer>
      </WithSidebar>
    );
  }

  return (
    <WithSidebar>
      {/* Detail PO */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Purchase Order: {po.po_kode}</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Informasi Umum PO */}
          <div className="col-span-12 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Informasi Umum
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Kode PO</Label>
                <p className="font-medium text-base">{po.po_kode}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Kode PR</Label>
                <p className="font-medium text-base">{po.purchase_request.pr_kode}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-base">{po.po_status}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Person in Charger
                </Label>
                <p className="font-medium text-base">{po.po_pic}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Tanggal PO
                </Label>
                <p className="font-medium text-base">
                  {formatTanggal(po.created_at)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Tanggal Estimasi
                </Label>
                <p className="font-medium text-base">
                  {formatTanggal(po.po_estimasi)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Diperbarui Pada
                </Label>
                <p className="font-medium text-base">
                  {formatTanggal(po.updated_at)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Keterangan
                </Label>
                <p className="font-medium text-base">
                  {po.po_keterangan || "Tidak ada keterangan."}
                </p>
              </div>
            </div>
          </div>
        </SectionBody>
        <SectionFooter>
          {/* {po.po_status !== "received" && (
            <EditPODialog po={po} refresh={setRefresh} />
          )} */}
        </SectionFooter>
      </SectionContainer>

      <SectionContainer span={12}>
        <SectionHeader>Barang dalam PR terkait PO: {po.po_kode}</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Daftar Barang */}
          <div className="col-span-12 space-y-4">
            <div className="w-full border border-border rounded-sm overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="[&>th]:border">
                    <TableHead className="w-[50px] text-center">No</TableHead>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Nama Part</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Berdasarkan MR</TableHead>
                    {/* <TableHead>Aksi</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pr && pr.details.length > 0 ? (
                    pr.details.map((item, index) => (
                      <TableRow key={index} className="[&>td]:border">
                        <TableCell className="w-[50px] text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>{item.dtl_pr_part_number}</TableCell>
                        <TableCell>{item.dtl_pr_part_name}</TableCell>
                        <TableCell>{item.dtl_pr_satuan}</TableCell>
                        <TableCell>{item.dtl_pr_qty}</TableCell>
                        <TableCell>{item.mr?.mr_kode}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="[&>td]:border">
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-4"
                      >
                        Tidak ada barang dalam Material Request ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </SectionBody>
        <SectionFooter></SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
