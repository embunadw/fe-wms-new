import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type { PurchaseRequest } from "@/types"; // Pastikan path ini benar
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
import { getPrByKode, clearSignature } from "@/services/purchase-request";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";

export function PurchaseRequestDetail() {
    const { user } = useAuth();
  const { kode } = useParams<{ kode: string }>();
  const [pr, setPr] = useState<PurchaseRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
const [hasPrinted, setHasPrinted] = useState(false);
  // const [refresh, setRefresh] = useState<boolean>(false);
  const [showSignature, setShowSignature] = useState(false);


  
  useEffect(() => {
    async function fetchMrDetail() {
      if (!kode) {
        toast.error("Kode Purchase Request tidak ditemukan di URL.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await getPrByKode(kode);
        if (res) {
          setPr(res);
        } else {
          toast.error(`Purchase Request dengan kode ${kode} tidak ditemukan.`);
          setPr(null);
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
        setPr(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMrDetail();
  }, [kode]);

   useEffect(() => {
      if (!showSignature || !kode) return;
  
      const interval = setInterval(async () => {
        try {
          const res = await getPrByKode(kode);
  
          if (res?.signature_url) {
            setPr(res);
            setHasPrinted(false);
            setShowSignature(false);
            toast.success("Tanda tangan diterima! Siap untuk print.");
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error polling signature:", error);
        }
      }, 2000);
  
      return () => clearInterval(interval);
    }, [showSignature, kode]);



const handlePrintClick = async () => {
  // 🔴 Sudah pernah print → WAJIB scan ulang
  if (hasPrinted) {
    setShowSignature(true);
    return;
  }

  // 🔴 Belum ada TTD → QR
  if (!pr?.signature_url) {
    setShowSignature(true);
    return;
  }

  // 🟢 Ada TTD & belum pernah print
  window.print();

  setHasPrinted(true);

  // 🔥 reset FE
  setPr(prev =>
    prev ? { ...prev, signature_url: null, sign_at: null } : prev
  );

  // 🔥 clear backend
  if (kode) {
    await clearSignature(kode);
  }
};




  if (isLoading && !pr) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Purchase Request...</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Memuat data...
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
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              PR dengan kode "{kode}" tidak ditemukan.
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
           {showSignature && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center print:hidden">
          <div className="bg-white p-6 rounded-md w-[350px] space-y-4 text-center">
            <h3 className="font-semibold text-lg">Scan untuk Tanda Tangan</h3>

            <QRCodeCanvas
              value={`http://10.10.6.175:5173/pr-sign/${encodeURIComponent(
                pr.pr_kode
              )}`}
              size={200}
              className="mx-auto"
            />

            <p className="text-sm text-muted-foreground">
              Setelah tanda tangan, dokumen akan siap di-print
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSignature(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail PR */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Purchase Request: {pr.pr_kode}</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Informasi Umum MR */}
          <div className="col-span-12 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Informasi Umum
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Kode PR</Label>
                <p className="font-medium text-base">{pr.pr_kode}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">PIC</Label>
                <p className="font-medium text-base">{pr.pr_pic}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Lokasi pembuat PR
                </Label>
                <p className="font-medium text-base">{pr.pr_lokasi}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-base">{pr.pr_status}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Tanggal PR
                </Label>
                {/* Pastikan mr.tanggal_mr adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">
                  {formatTanggal(pr.created_at)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Diperbarui Pada
                </Label>
                <p className="font-medium text-base">
                  {formatTanggal(pr.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </SectionBody>
        <SectionFooter>
         <Button
            variant="outline"
            className="print:hidden"
            onClick={handlePrintClick}
          >
            <Printer className="mr-2" />
            {pr.signature_url ? "Print" : "Tanda Tangan & Print"}
          </Button>
        </SectionFooter>
      </SectionContainer>

      <SectionContainer span={12}>
        <SectionHeader>Barang dalam PR ini</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Daftar Barang */}
          <div className="col-span-12 space-y-4">
            <div className="w-full border border-border rounded-sm overflow-x-auto">
              <Table className="w-full">
<TableHeader>
  <TableRow className="[&>th]:border">
    <TableHead>No</TableHead>
    <TableHead>Part Number</TableHead>
    <TableHead>Nama Part</TableHead>
    <TableHead>Satuan</TableHead>
    <TableHead>Jumlah</TableHead>
    <TableHead>Berdasarkan MR</TableHead>
  </TableRow>
</TableHeader>

                <TableBody>
                  {pr.details.length > 0 ? (
                    pr.details.map((item, index) => (
                 <TableRow key={item.pr_id} className="[&>td]:border">
  <TableCell>{index + 1}</TableCell>
  <TableCell>{item.dtl_pr_part_number}</TableCell>
  <TableCell>{item.dtl_pr_part_name}</TableCell>
  <TableCell>{item.dtl_pr_satuan}</TableCell>
  <TableCell>{item.dtl_pr_qty}</TableCell>
  <TableCell>{item.mr?.mr_kode}</TableCell>
</TableRow>

                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Tidak ada barang
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
     {pr.signature_url && (
                <div className="hidden print:flex mt-16 justify-end px-8 pb-8">
                  <div className="text-center w-[220px]">
                    <p className="font-semibold mb-2">Tanda Tangan</p>
             <img
  src={`http://10.10.6.175:8000/storage/${pr.signature_url}`}
  alt="signature"
  className="h-28 mx-auto border-b-2 border-black"
/>

                    <p className="text-sm mt-2">{user?.nama ?? pr.pr_pic}</p>
                    {pr.sign_at && (
                      <p className="text-xs text-muted-foreground">
                        {formatTanggal(new Date(pr.sign_at))}
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </SectionBody>
        <SectionFooter></SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
