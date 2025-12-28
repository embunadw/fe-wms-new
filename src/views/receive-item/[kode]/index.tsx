import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type { RI } from "@/types";
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
import { getRIByKode } from "@/services/receive-item";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";


export function ReceiveDetail() {
  const { kode } = useParams<{ kode: string }>();
  const [ri, setRi] = useState<RI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await getRIByKode(kode!);
        setRi(res);
      } catch (err) {
        toast.error("Gagal mengambil detail receive");
      } finally {
        setLoading(false);
      }
    }

    if (kode) fetchDetail();
  }, [kode]);

  if (loading) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Receive...</SectionHeader>
          <SectionBody className="flex justify-center py-10 text-muted-foreground">
            Memuat data...
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!ri) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Receive Tidak Ditemukan</SectionHeader>
          <SectionBody className="flex justify-center py-10 text-muted-foreground">
            Data receive tidak ditemukan
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  return (
    <WithSidebar>
      {/* ================= HEADER ================= */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Receive Item</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Informasi Umum
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">Kode RI</Label>
                <p className="font-medium">{ri.ri_kode}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Tanggal</Label>
                <p className="font-medium">
                  {formatTanggal(ri.ri_tanggal)}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">
                  Gudang Penerima
                </Label>
                <p className="font-medium">{ri.ri_lokasi}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">PO</Label>
                <p className="font-medium">
                  {ri.purchase_order?.po_kode}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">
                  Status PO
                </Label>
                <p className="font-medium">
                  {ri.purchase_order?.po_status}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">PIC</Label>
                <p className="font-medium">{ri.ri_pic}</p>
              </div>

              <div className="col-span-2">
                <Label className="text-muted-foreground text-sm">
                  Keterangan
                </Label>
                <p className="font-medium">
                  {ri.ri_keterangan || "-"}
                </p>
              </div>
            </div>
          </div>
        </SectionBody>
        <SectionFooter>
          <Button
            variant={"outline"}
            onClick={() => window.print()}
            className="print:hidden"
          >
            <Printer />
          </Button>
        </SectionFooter>
      </SectionContainer>

      {/* ================= DETAIL BARANG ================= */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Barang Diterima</SectionHeader>
        <SectionBody>
          <div className="border rounded-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="[&>th]:border">
                  <TableHead className="w-[50px] text-center">No</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Nama Part</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Qty Diterima</TableHead>
                  <TableHead>Untuk MR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ri.details.length > 0 ? (
                  ri.details.map((d, i) => (
                    <TableRow key={i} className="[&>td]:border">
                      <TableCell className="text-center">
                        {i + 1}
                      </TableCell>
                      <TableCell>{d.dtl_ri_part_number}</TableCell>
                      <TableCell>{d.dtl_ri_part_name}</TableCell>
                      <TableCell>{d.dtl_ri_satuan}</TableCell>
                      <TableCell>{d.dtl_ri_qty}</TableCell>
                      <TableCell>{d.mr_id}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      Tidak ada detail barang
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>
      </SectionContainer>
    </WithSidebar>
  );
}
