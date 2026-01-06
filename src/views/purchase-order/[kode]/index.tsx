import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type { POReceive, PurchaseRequest } from "@/types";
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
import { getPrByKode } from "@/services/purchase-request";
import { getPoByKode } from "@/services/purchase-order";
import { EditPODialog } from "@/components/dialog/edit-po";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { getCurrentUser } from "@/services/auth";
import type {UserComplete } from "@/types";

export default function PurchaseOrderDetail() {
  const { kode } = useParams<{ kode: string }>();

  const [po, setPo] = useState<POReceive | null>(null);
  const [pr, setPr] = useState<PurchaseRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
    const [user, setUser] = useState<UserComplete | null>(null);


  useEffect(() => {
    async function fetchPO() {
      if (!kode) return;

      setIsLoading(true);
      try {
        const res = await getPoByKode(kode);
        setPo(res ?? null);
      } catch (err) {
        toast.error("Gagal mengambil detail PO");
        setPo(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPO();
  }, [kode, refresh]);

  useEffect(() => {
    async function fetchPR() {
      if (!po) return;

      try {
        const res = await getPrByKode(po.purchase_request.pr_kode);
        setPr(res ?? null);
      } catch {
        toast.error("Gagal mengambil data PR");
        setPr(null);
      }
    }

    fetchPR();
  }, [po]);

    useEffect(() => {
      async function fetchUser() {
        try {
          const userData = await getCurrentUser();
          console.log("✅ User data loaded:", userData); // DEBUG
          setUser(userData);
        } catch (error) {
          console.error("❌ Error fetching user:", error);
          toast.error("Gagal mengambil data user");
        }
      }
      fetchUser();
    }, []);


  if (isLoading) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Purchase Order...</SectionHeader>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!po) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>PO Tidak Ditemukan</SectionHeader>
        </SectionContainer>
      </WithSidebar>
    );
  }

  return (
  <WithSidebar>
    {/* ================= DETAIL PO ================= */}
    <SectionContainer span={12}>
      <SectionHeader>
        Detail Purchase Order: {po.po_kode}
      </SectionHeader>

      <SectionBody className="grid grid-cols-12 gap-6">
        {/* Informasi Umum */}
        <div className="col-span-12 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Informasi Umum
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Kode PO</Label>
              <p className="font-medium">{po.po_kode}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <p className="font-medium">{po.po_status}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Tanggal PO</Label>
              <p className="font-medium">
                {formatTanggal(po.created_at)}
              </p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">
                Tanggal Estimasi
              </Label>
              <p className="font-medium">
                {formatTanggal(po.po_estimasi)}
              </p>
            </div>
          </div>
        </div>
      </SectionBody>

      <SectionFooter>
        {user?.role === "purchasing" && po.po_status === "pending" && (
            <EditPODialog po={po} refresh={setRefresh} />
          )}
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
      <SectionHeader>
        Barang dalam PR
      </SectionHeader>

      <SectionBody className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="w-full border border-border rounded-sm overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">No</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pr?.details?.length ? (
                  pr.details.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>{item.dtl_pr_part_number}</TableCell>
                      <TableCell>{item.dtl_pr_part_name}</TableCell>
                      <TableCell className="flex justify-center">
                        {item.dtl_pr_qty}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-6"
                    >
                      Tidak ada barang dalam PR.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SectionBody>
    </SectionContainer>
  </WithSidebar>
);

}
