import WithSidebar from "@/components/layout/WithSidebar";
import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { downloadSpbExcel, getAllReport } from "@/services/spb";
import type { SpbReport } from "@/types";
import { formatTanggal } from "@/lib/utils";
import { MyPagination } from "@/components/my-pagination";
import { PagingSize } from "@/types/enum";
import { toast } from "sonner";

export default function ReportSpb() {
  const [data, setData] = useState<SpbReport[]>([]);
  const [filtered, setFiltered] = useState<SpbReport[]>([]);
  const [toShow, setToShow] = useState<SpbReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllReport().then((res) => {
      setData(res);
      setFiltered(res);
    });
  }, []);

  useEffect(() => {
    let temp = data;

    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (s) =>
          s.spb_no.toLowerCase().includes(q) ||
          s.dtl_spb_part_name.toLowerCase().includes(q) ||
          s.dtl_spb_part_number.toLowerCase().includes(q) ||
          s.po_no?.toLowerCase().includes(q) ||
          s.do_no?.toLowerCase().includes(q) ||
          s.invoice_no?.toLowerCase().includes(q)
      );
    }

    setFiltered(temp);
    setCurrentPage(1);
  }, [search, data]);

  /* ================= PAGING ================= */
  useEffect(() => {
    const start = (currentPage - 1) * PagingSize;
    const end = start + PagingSize;
    setToShow(filtered.slice(start, end));
  }, [filtered, currentPage]);

  function resetFilter() {
    setSearch("");
    toast.success("Filter direset");
  }

  return (
    <WithSidebar>
      <SectionContainer span={12}>
        <SectionHeader>Report SPB</SectionHeader>

        <SectionBody className="space-y-3">
          {/* FILTER + EXPORT */}
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Cari SPB / Part / PO / DO / Invoice"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />

            <Button variant="destructive" size="icon" onClick={resetFilter}>
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="ml-auto"
              onClick={downloadSpbExcel}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>

          {/* TABLE */}
          <div className="border rounded-sm overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>NO</TableHead>
                  <TableHead>TGL SPB</TableHead>
                  <TableHead>NO SPB</TableHead>
                  <TableHead>PART NUMBER</TableHead>
                  <TableHead>PART NAME</TableHead>
                  <TableHead>QTY</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>KODE UNIT</TableHead>
                  <TableHead>TYPE UNIT</TableHead>
                  <TableHead>BRAND</TableHead>
                  <TableHead>HM</TableHead>
                  <TableHead>PROBLEM/REMARK</TableHead>
                  <TableHead>SECTION</TableHead>
                  <TableHead>PIC GMI</TableHead>
                  <TableHead>PIC PPA</TableHead>
                  <TableHead>NO WO</TableHead>
                  <TableHead>DATE INPUT</TableHead>
                  <TableHead>STATUS WO</TableHead>
                  <TableHead>TANGGAL SPB to PO</TableHead>
                  <TableHead>NO PO</TableHead>
                  <TableHead>NO SO</TableHead>
                  <TableHead>DATE INPUT</TableHead>
                  <TableHead>NO DO</TableHead>
                  <TableHead>DATE INPUT</TableHead>
                  <TableHead>NO INVOICE</TableHead>
                  <TableHead>TANGGAL INVOICE</TableHead>
                  <TableHead>TANGGAL KIRIM EMAIL</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {toShow.length > 0 ? (
                  toShow.map((spb, i) => (
                    <TableRow key={`${spb.spb_id}-${spb.do_no}-${spb.invoice_no}-${i}`}>
                      <TableCell>
                        {PagingSize * (currentPage - 1) + (i + 1)}
                      </TableCell>
                      <TableCell>{formatTanggal(spb.created_at)}</TableCell>
                      <TableCell>{spb.spb_no}</TableCell>
                      <TableCell>{spb.dtl_spb_part_number}</TableCell>
                      <TableCell>{spb.dtl_spb_part_name}</TableCell>
                      <TableCell>{spb.dtl_spb_qty}</TableCell>
                      <TableCell>{spb.dtl_spb_part_satuan}</TableCell>
                      <TableCell>{spb.spb_kode_unit}</TableCell>
                      <TableCell>{spb.spb_tipe_unit}</TableCell>
                      <TableCell>{spb.spb_brand}</TableCell>
                      <TableCell>{spb.spb_hm}</TableCell>
                      <TableCell>{spb.spb_problem_remark}</TableCell>
                      <TableCell>{spb.spb_section}</TableCell>
                      <TableCell>{spb.spb_pic_gmi}</TableCell>
                      <TableCell>{spb.spb_pic_ppa}</TableCell>
                      <TableCell>{spb.spb_no_wo}</TableCell>
                      <TableCell>{spb.do_created_at}</TableCell>
                      <TableCell>{spb.spb_status}</TableCell>
                      <TableCell>{spb.spb_tanggal}</TableCell>
                      <TableCell>{spb.po_no ?? "-"}</TableCell>
                      <TableCell>{spb.so_no ?? "-"}</TableCell>
                      <TableCell>{spb.po_created_at}</TableCell>
                      <TableCell>{spb.do_no ?? "-"}</TableCell>
                      <TableCell>{spb.do_created_at}</TableCell>
                      <TableCell>{spb.invoice_no}</TableCell>
                      <TableCell>{spb.invoice_date}</TableCell>
                      <TableCell>{spb.invoice_email_date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={20}
                      className="text-center text-muted-foreground"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>

        <SectionFooter>
          <MyPagination
            data={filtered}
            currentPage={currentPage}
            triggerNext={() => setCurrentPage((p) => p + 1)}
            triggerPrevious={() =>
              setCurrentPage((p) => (p > 1 ? p - 1 : 1))
            }
            triggerPageChange={setCurrentPage}
          />
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
