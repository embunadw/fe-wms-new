// pages/material-request/[kode].tsx atau sesuai routing Anda
import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type {MRReceive } from "@/types"; // Pastikan path ini benar
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
import { Label } from "@/components/ui/label"; // Import Label
import { formatTanggal } from "@/lib/utils";
import { parse } from "date-fns";
import { getMrByKode } from "@/services/material-request";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function MaterialRequestDetail() {
  const { kode } = useParams<{ kode: string }>();
  const [mr, setMr] = useState<MRReceive | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMrDetail() {
      if (!kode) {
        toast.error("Kode Material Request tidak ditemukan di URL.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await getMrByKode(kode);
        if (res) {
          setMr(res);
        } else {
          toast.error(`Material Request dengan kode ${kode} tidak ditemukan.`);
          setMr(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail MR:", error);
        if (error instanceof Error) {
          toast.error(`Gagal mengambil detail MR: ${error.message}`);
        } else {
          toast.error(
            "Terjadi kesalahan saat mengambil detail Material Request."
          );
        }
        setMr(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMrDetail();
  }, [kode]);

  if (isLoading) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Material Request...</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Memuat data...
            </div>
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!mr) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Material Request Tidak Ditemukan</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              MR dengan kode "{kode}" tidak ditemukan.
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
      {/* Detail MR */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Material Request: {mr.mr_kode}</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Informasi Umum MR */}
          <div className="col-span-12 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Informasi Umum
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Kode MR</Label>
                <p className="font-medium text-base">{mr.mr_kode}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">PIC</Label>
                <p className="font-medium text-base">{mr.mr_pic}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Lokasi</Label>
                <p className="font-medium text-base">{mr.mr_lokasi}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-base">{mr.mr_status}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Tanggal MR
                </Label>
                {/* Pastikan mr.tanggal_mr adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">
                  {formatTanggal(
                    parse(mr.mr_tanggal, "d/M/yyyy", new Date())
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Due date
                </Label>
                {/* Pastikan mr.tanggal_estimasi adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">
                  {formatTanggal(
                    parse(mr.mr_due_date, "d/M/yyyy", new Date())
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Diperbarui Pada
                </Label>
                <p className="font-medium text-base">
                  {mr.updated_at
                    ? formatTanggal(new Date(mr.updated_at))
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </SectionBody>
        <SectionFooter>
          {/* <EditMRDialog mr={mr} refresh={setRefresh} onSubmit={handleEditMR} /> */}
          <Button
            variant={"outline"}
            onClick={() => window.print()}
            className="print:hidden"
          >
            <Printer />
          </Button>
        </SectionFooter>
      </SectionContainer>

      <SectionContainer span={12}>
        <SectionHeader>Detail Barang</SectionHeader>
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
                    <TableHead>Prioritas</TableHead>
                    <TableHead>Jumlah Permintaan</TableHead>
                    <TableHead>Jumlah Diterima</TableHead>
                    {/* <TableHead>Aksi</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mr.details && mr.details.length > 0 ? (
                    mr.details.map((item, index) => (
                      <TableRow key={index} className="[&>td]:border">
                        <TableCell className="w-[50px] text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="max-w-40 break-words whitespace-normal">
                          {item.dtl_mr_part_number}
                        </TableCell>
                        <TableCell className="max-w-40 break-words whitespace-normal">
                          {item.dtl_mr_part_name}
                        </TableCell>
                        <TableCell className="max-w-40 break-words whitespace-normal">
                          {item.dtl_mr_satuan}
                        </TableCell>
                        <TableCell className="max-w-40 break-words whitespace-normal">
                          {item.dtl_mr_prioritas}
                        </TableCell>
                        <TableCell className="max-w-40 break-words whitespace-normal">
                          {item.dtl_mr_qty_request}
                        </TableCell>
                        <TableCell className="max-w-40 break-words whitespace-normal">
                          {item.dtl_mr_qty_received}
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
