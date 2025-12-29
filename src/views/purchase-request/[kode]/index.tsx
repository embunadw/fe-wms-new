// pages/purchase-request/[kode].tsx
import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type { PR } from "@/types";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { formatTanggal } from "@/lib/utils";
import { getPrByKode } from "@/services/purchase-request";
import { ArrowLeft } from "lucide-react";

export function PurchaseRequestDetail() {
  const { kode } = useParams<{ kode: string }>();
  const navigate = useNavigate();
  const [pr, setPr] = useState<PR | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPrDetail() {
      if (!kode) {
        toast.error("Kode Purchase Request tidak ditemukan di URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // ✅ Decode URL parameter
        const decodedKode = decodeURIComponent(kode);
        const res = await getPrByKode(decodedKode);
        console.log("API response:", res);

        if (res) {
          // ✅ Pastikan order_item selalu array
          setPr({
            ...res,
            order_item: res.order_item || []
          });
        } else {
          toast.error(`Purchase Request dengan kode ${decodedKode} tidak ditemukan.`);
          setPr(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail PR:", error);
        if (error instanceof Error) {
          toast.error(`Gagal mengambil detail PR: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil detail PR.");
        }
        setPr(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrDetail();
  }, [kode]);

  if (isLoading) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Purchase Request...</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p>Memuat data...</p>
              </div>
            </div>
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!pr) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Purchase Request Tidak Ditemukan</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex flex-col items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg gap-4">
              <p>PR dengan kode "{kode}" tidak ditemukan.</p>
              <Button onClick={() => navigate('/purchase-request')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar PR
              </Button>
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
      {/* Header dengan tombol kembali */}
      <SectionContainer span={12}>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <Button 
              onClick={() => navigate('/purchase-request')} 
              variant="ghost"
              size="sm"
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar PR
            </Button>
          </div>
        </SectionBody>
      </SectionContainer>

      {/* Detail PR */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Purchase Request: {pr.kode}</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Informasi Umum PR */}
          <div className="col-span-12 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Informasi Umum
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Kode PR</Label>
                <p className="font-medium text-base">{pr.kode}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">PIC</Label>
                <p className="font-medium text-base">{pr.pic}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">
                  Lokasi Pembuat PR
                </Label>
                <p className="font-medium text-base">{pr.lokasi}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-base">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pr.status === 'open' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {pr.status === 'open' ? 'Open' : 'Close'}
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Tanggal Dibuat</Label>
                <p className="font-medium text-base">
                  {formatTanggal(pr.created_at)}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Terakhir Diperbarui</Label>
                <p className="font-medium text-base">
                  {formatTanggal(pr.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </SectionBody>
      </SectionContainer>

      {/* Daftar Item */}
      <SectionContainer span={12}>
        <SectionHeader>
          Daftar Barang ({pr.order_item?.length || 0} item)
        </SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-4">
            <div className="w-full border border-border rounded-sm overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border text-center w-[60px]">No</TableHead>
                    <TableHead className="border">Part Number</TableHead>
                    <TableHead className="border">Nama Part</TableHead>
                    <TableHead className="border text-center">Satuan</TableHead>
                    <TableHead className="border text-center">Jumlah</TableHead>
                    <TableHead className="border">Berdasarkan MR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pr.order_item && pr.order_item.length > 0 ? (
                    pr.order_item.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="border text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="border font-mono text-sm">
                          {item.part_number || '-'}
                        </TableCell>
                        <TableCell className="border">
                          {item.part_name || '-'}
                        </TableCell>
                        <TableCell className="border text-center">
                          {item.satuan || '-'}
                        </TableCell>
                        <TableCell className="border text-center font-medium">
                          {item.qty || 0}
                        </TableCell>
                        <TableCell className="border">
                          {item.kode_mr || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="border text-center text-muted-foreground py-8"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-lg">Tidak ada barang dalam Purchase Request ini.</p>
                          <p className="text-sm">Belum ada item yang ditambahkan.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </SectionBody>
        <SectionFooter>
          <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
            <p>Total barang: {pr.order_item?.length || 0} item</p>
            <p>
              Total quantity: {
                pr.order_item?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0
              }
            </p>
          </div>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}