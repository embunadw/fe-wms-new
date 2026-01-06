import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type { DeliveryReceive, MRReceive } from "@/types"; 
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner"; 
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
import { getDeliveryByKode, updateDelivery } from "@/services/delivery";
import { getMrByKode } from "@/services/material-request";
import { EditDeliveryDialog } from "@/components/dialog/edit-delivery";
import { DeliveryTimeline } from "@/views/delivery/delivery-timeline";
import { ConfirmDialog } from "@/components/dialog/edit-status-delivery";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function DeliveryDetail() {
  const { kode } = useParams<{ kode: string }>();
  const [mr, setMr] = useState<MRReceive | null>(null);
  const [dlvry, setdlvry] = useState<DeliveryReceive | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { user } = useAuth();
  const [loadingDelivery, setLoadingDelivery] = useState(true);
  const [loadingMr, setLoadingMr] = useState(true);

  useEffect(() => {
    async function fetchDeliveryDetail() {
      setLoadingDelivery(true);
      try {
        const res = await getDeliveryByKode(kode!);
        setdlvry(res ?? null);
      } catch {
        setdlvry(null);
      } finally {
        setLoadingDelivery(false);
      }
    }

    if (kode) fetchDeliveryDetail();
  }, [kode, refresh]);


  useEffect(() => {
    async function fetchMrDetail() {
      if (!dlvry?.mr?.mr_kode) return;

      setLoadingMr(true);
      try {
        const res = await getMrByKode(dlvry.mr.mr_kode);
        setMr(res ?? null);
      } catch {
        setMr(null);
      } finally {
        setLoadingMr(false);
      }
    }

    fetchMrDetail();
  }, [dlvry]);


  async function updateDeliveryStatus(status: "on delivery" | "delivered") {
    if (!dlvry) {
      toast.error("Delivery tidak ditemukan.");
      return;
    }

    try {
      if (status === "on delivery") {
        const res = await updateDelivery(dlvry.dlv_kode, {
          status: "on delivery",
        });
        if (res) {
          toast.success(
            "Status delivery berhasil diperbarui ke 'on delivery'."
          );
          setRefresh((prev) => !prev);
        } else {
          toast.error("Gagal memperbarui status delivery.");
        }
      } else if (status === "delivered") {
        const res = await updateDelivery(dlvry.dlv_kode, {
          status: "delivered",
        });
        if (res) {
          toast.success(
            "Status delivery berhasil diperbarui ke 'on delivery'."
          );
          setRefresh((prev) => !prev);
        } else {
          toast.error("Gagal memperbarui status delivery.");
        }
      }
    } catch (error) {
      console.error("Gagal memperbarui status delivery:", error);
      if (error instanceof Error) {
        toast.error(`Gagal memperbarui status delivery: ${error.message}`);
      } else {
        toast.error("Terjadi kesalahan saat memperbarui status delivery.");
      }
    }
  }

  if (loadingDelivery) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Delivery...</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Memuat data...
            </div>
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!dlvry) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Delivery Tidak Ditemukan</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Delivery dengan kode "{kode}" tidak ditemukan.
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
      {/* Detail Delivery */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Delivery: {dlvry.dlv_kode}
        </SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
          <DeliveryTimeline status={dlvry.dlv_status as "pending" | "on delivery" | "delivered"} />
        </div>
          {/* Informasi Umum Delivery */}
          <div className="col-span-12 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Informasi Umum
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Kode IT</Label>
                <p className="font-medium text-base">{dlvry.dlv_kode}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Referensi MR
                </Label>
                <p className="font-medium text-base">{dlvry.mr?.mr_kode}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-base">{dlvry.dlv_status}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Person in charge
                </Label>
                <p className="font-medium text-base">{dlvry.dlv_pic}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Dari gudang
                </Label>
                <p className="font-medium text-base">{dlvry.dlv_dari_gudang}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Ke gudang
                </Label>
                <p className="font-medium text-base">{dlvry.dlv_ke_gudang}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Ekspedisi yang digunakan
                </Label>
                <p className="font-medium text-base">{dlvry.dlv_ekspedisi}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  No. resi
                </Label>
                <p className="font-medium text-base">{dlvry.dlv_no_resi}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Dibuat pada
                </Label>
                {/* Pastikan mr.tanggal_mr adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">
                  {formatTanggal(dlvry.created_at)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Diperbarui pada
                </Label>
                <p className="font-medium text-base">
                  {formatTanggal(dlvry.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </SectionBody>
        <SectionFooter className="flex gap-2">
          { user?.role === "logistik" &&  dlvry.dlv_status !== "pending" && (
            <EditDeliveryDialog delivery={dlvry} refresh={setRefresh} />
          )}
              <EditDeliveryDialog delivery={dlvry} refresh={setRefresh} />
                {user?.role === "logistik" && dlvry.dlv_status === "pending" && 
                  user?.lokasi === dlvry.dlv_dari_gudang && (
                  <ConfirmDialog
                    text="Naikkan status ke on delivery"
                    onClick={() => {
                      updateDeliveryStatus("on delivery");
                    }}
                  />
                )}
                <Button
                  variant={"outline"}
                  onClick={() => window.print()}
                  className="print:hidden"
                >
                  <Printer />
                </Button>
                {user?.role === "user" && dlvry.dlv_status === "on delivery" &&
            user?.lokasi === dlvry.dlv_ke_gudang && (
            <ConfirmDialog
              text="Selesaikan delivery"
              onClick={() => {
                updateDeliveryStatus("delivered");
              }}
          />
      )}
        </SectionFooter>
      </SectionContainer>

      <SectionContainer span={12}>
        <SectionHeader>Barang dari Referensi MR</SectionHeader>
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
                    <TableHead>Jumlah diminta</TableHead>
                    <TableHead>Jumlah diterima</TableHead>
                    <TableHead>Jumlah on delivery</TableHead>
                    <TableHead>Jumlah pending delivery</TableHead>
                    <TableHead>Dari gudang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mr?.details && mr.details.length > 0 ? (
                    mr.details.map((item, index) => (
                      <TableRow key={index} className="[&>td]:border">
                        <TableCell className="w-[50px] text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>{item.dtl_mr_part_number}</TableCell>
                        <TableCell>{item.dtl_mr_part_name}</TableCell>
                        <TableCell>{item.dtl_mr_satuan}</TableCell>
                        <TableCell>{item.dtl_mr_qty_request}</TableCell>
                        <TableCell>{item.dtl_mr_qty_received}</TableCell>
                        <TableCell>
                          {dlvry.details.find(
                            (e) => e.dtl_dlv_part_number === item.dtl_mr_part_number
                          )?.qty_on_delivery || 0}
                        </TableCell>
                        <TableCell>
                          {dlvry.details.find(
                            (e) => e.dtl_dlv_part_number === item.dtl_mr_part_number
                          )?.qty_pending || 0}
                        </TableCell>
                        <TableCell>
                          {dlvry.dlv_dari_gudang ?? "-"}
                        </TableCell>
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
