import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // <-- Impor
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTanggal } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth";
import { getPurchasedPO } from "@/services/receive-item";
import { getAllRi } from "@/services/receive-item";
import type { POReceive, RI, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import CreateRIForm from "@/components/form/create-ri";

export default function ReceiveItem() {
  const [user, setUser] = useState<UserComplete | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  // === Section: State dan Logika untuk Tabel PO ===
  const [pos, setPos] = useState<POReceive[]>([]);
  const [filteredPos, setFilteredPos] = useState<POReceive[]>([]);
  const [poToShow, setPoToShow] = useState<POReceive[]>([]);
  const [currentPagePo, setCurrentPagePo] = useState<number>(1);
  // State Filter PO
  const [kodePo, setKodePo] = useState<string>("");
  const [kodePr, setKodePr] = useState<string>("");
  const [statusPo, setStatusPo] = useState<string>("");

  // === Section: State dan Logika untuk Tabel RI ===
  const [ris, setRis] = useState<RI[]>([]);
  const [filteredRis, setFilteredRis] = useState<RI[]>([]);
  const [riToShow, setRiToShow] = useState<RI[]>([]);
  const [currentPageRi, setCurrentPageRi] = useState<number>(1);
  // State Filter RI
  const [kodeRi, setKodeRi] = useState<string>("");
  const [kodePoRi, setKodePoRi] = useState<string>(""); // Filter RI by PO code
  const [gudang, setGudang] = useState<string>("");
  const [picRi, setPicRi] = useState<string>("");

  // --- Fetch data awal (user, PO, RI) ---
  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [poResult, riResult] = await Promise.all([
          getPurchasedPO(),
          getAllRi(),
        ]);
        setPos(poResult);
        setRis(riResult);
      } catch (error) {
        toast.error(
          `Gagal mengambil data awal: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
    fetchInitialData();
  }, [refresh]);

  // --- useEffect untuk filtering Tabel PO ---
  useEffect(() => {
    let filtered = pos;
    if (kodePo) {
      filtered = filtered.filter((p) =>
        p.po_kode.toLowerCase().includes(kodePo.toLowerCase())
      );
    }
    if (kodePr) {
      filtered = filtered.filter((p) =>
        p.purchase_request.pr_kode?.toLowerCase().includes(kodePr.toLowerCase())
      );
    }
    if (statusPo) {
      filtered = filtered.filter((p) => p.po_status === statusPo);
    }
    setFilteredPos(filtered);
    setCurrentPagePo(1);
  }, [pos, kodePo, kodePr, statusPo]);

  // --- useEffect untuk paginasi Tabel PO ---
  useEffect(() => {
    const startIndex = (currentPagePo - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setPoToShow(filteredPos?.slice(startIndex, endIndex) ?? []);

  }, [filteredPos, currentPagePo]);

  // --- useEffect untuk filtering Tabel RI ---
  useEffect(() => {
    let filtered = ris;
    if (kodeRi) {
      filtered = filtered.filter((r) =>
        r.ri_kode.toLowerCase().includes(kodeRi.toLowerCase())
      );
    }
    if (kodePoRi) {
      filtered = filtered.filter((r) =>
        r.purchase_order.po_kode.toLowerCase().includes(kodePoRi.toLowerCase())
      );
    }
    if (gudang) {
      filtered = filtered.filter((r) =>
        r.ri_lokasi.toLowerCase().includes(gudang.toLowerCase())
      );
    }
    if (picRi) {
      filtered = filtered.filter((r) =>
        r.ri_pic?.toLowerCase().includes(picRi.toLowerCase())
      );
    }
    setFilteredRis(filtered);
    setCurrentPageRi(1);
  }, [ris, kodeRi, kodePoRi, gudang, picRi]);

  // --- useEffect untuk paginasi Tabel RI ---
  useEffect(() => {
    const startIndex = (currentPageRi - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setRiToShow(filteredRis.slice(startIndex, endIndex));
  }, [filteredRis, currentPageRi]);

  // --- Fungsi Helper untuk Tabel PO ---
  function resetFiltersPo() {
    setKodePo("");
    setKodePr("");
    setStatusPo("");
    toast.success("Filter PO telah direset.");
  }
  function nextPagePo() {
    setCurrentPagePo((prev) => prev + 1);
  }
  function previousPagePo() {
    setCurrentPagePo((prev) => (prev > 1 ? prev - 1 : 1));
  }
  function pageChangePo(page: number) {
    setCurrentPagePo(page);
  }

  // --- Fungsi Helper untuk Tabel RI ---
  function resetFiltersRi() {
    setKodeRi("");
    setKodePoRi("");
    setGudang("");
    setPicRi("");
    toast.success("Filter RI telah direset.");
  }
  function nextPageRi() {
    setCurrentPageRi((prev) => prev + 1);
  }
  function previousPageRi() {
    setCurrentPageRi((prev) => (prev > 1 ? prev - 1 : 1));
  }
  function pageChangeRi(page: number) {
    setCurrentPageRi(page);
  }

  return (
    <WithSidebar>
      {/* ==================== BAGIAN TABEL PO ==================== */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar PO Purchased (Siap Diterima)</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering PO */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-6 lg:col-span-7">
              <Input
                id="search-kode-po"
                placeholder="Ketik kode PO..."
                value={kodePo}
                onChange={(e) => setKodePo(e.target.value)}
              />
            </div>
            <div className="col-span-6 md:col-span-3 lg:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter PO
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filter PO</h4>
                    <p className="text-sm text-muted-foreground">
                      Saring PO berdasarkan kriteria.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filter-kode-pr">Kode PR</Label>
                      <Input
                        id="filter-kode-pr"
                        placeholder="Cari kode PR..."
                        value={kodePr}
                        onChange={(e) => setKodePr(e.target.value)}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={resetFiltersPo}
              >
                Hapus Filter
              </Button>
            </div>
          </div>
          {/* Tabel PO */}
          <div className="col-span-12 border rounded-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 border">No</TableHead>
                  <TableHead className="p-2 border">Kode PO</TableHead>
                  <TableHead className="p-2 border">Kode PR</TableHead>
                  <TableHead className="p-2 border">Tanggal PO</TableHead>
                  <TableHead className="p-2 border">Tanggal Estimasi</TableHead>
                  <TableHead className="p-2 border">Status</TableHead>
                  <TableHead className="p-2 border">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poToShow.length > 0 ? (
                  poToShow.map((po, index) => (
                    <TableRow key={po.po_id}>
                      <TableCell className="p-2 border">
                        {PagingSize * (currentPagePo - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="p-2 border">{po.po_kode}</TableCell>
                      <TableCell className="p-2 border">{po.purchase_request.pr_kode}</TableCell>
                      <TableCell className="p-2 border">
                        {formatTanggal(po.created_at)}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {formatTanggal(po.po_estimasi)}
                      </TableCell>
                      <TableCell className="p-2 border">{po.po_status}</TableCell>
                      <TableCell className="p-2 border">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/purchase-order/${encodeURIComponent(
                              po.po_kode
                            )}`}
                          >
                            Detail
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Tidak ada PO ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination
            data={filteredPos}
            triggerNext={nextPagePo}
            triggerPageChange={pageChangePo}
            triggerPrevious={previousPagePo}
            currentPage={currentPagePo}
          />
        </SectionFooter>
      </SectionContainer>

      {/* ==================== BAGIAN FORM BUAT RI ==================== */}
      <SectionContainer span={12}>
        <SectionHeader>Buat Receive Item (RI) Baru</SectionHeader>
        <SectionBody>
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            {user && <CreateRIForm setRefresh={setRefresh} user={user} />}
          </div>
        </SectionBody>
        <SectionFooter>
          <Button
            className="w-full flex gap-4"
            type="submit"
            form="create-ri-form"
          >
            Buat RI <Plus />
          </Button>
        </SectionFooter>
      </SectionContainer>

      {/* ==================== BAGIAN TABEL RI ==================== */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar History Receive Item</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering RI */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-6 lg:col-span-7">
              <Input
                id="search-kode-ri"
                placeholder="Ketik kode RI..."
                value={kodeRi}
                onChange={(e) => setKodeRi(e.target.value)}
              />
            </div>
            <div className="col-span-6 md:col-span-3 lg:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter RI
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Filter History RI
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Saring histori berdasarkan kriteria.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filter-ri-kodepo">Kode PO</Label>
                      <Input
                        id="filter-ri-kodepo"
                        placeholder="Cari kode PO..."
                        value={kodePoRi}
                        onChange={(e) => setKodePoRi(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-ri-gudang">Gudang Penerima</Label>
                      <Input
                        id="filter-ri-gudang"
                        placeholder="Cari gudang..."
                        value={gudang}
                        onChange={(e) => setGudang(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-ri-pic">PIC</Label>
                      <Input
                        id="filter-ri-pic"
                        placeholder="Cari PIC..."
                        value={picRi}
                        onChange={(e) => setPicRi(e.target.value)}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={resetFiltersRi}
              >
                Hapus Filter
              </Button>
            </div>
          </div>
          {/* Tabel RI */}
          <div className="col-span-12 border rounded-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 border">No</TableHead>
                  <TableHead className="p-2 border">Kode RI</TableHead>
                  <TableHead className="p-2 border">Kode PO</TableHead>
                  <TableHead className="p-2 border">Tanggal RI</TableHead>
                  <TableHead className="p-2 border">Gudang Penerima</TableHead>
                  <TableHead className="p-2 border">PIC</TableHead>
                  <TableHead className="p-2 border">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riToShow.length > 0 ? (
                  riToShow.map((ri, index) => (
                    <TableRow key={ri.ri_id}>
                      <TableCell className="p-2 border">
                        {PagingSize * (currentPageRi - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="p-2 border">{ri.ri_kode}</TableCell>
                      <TableCell className="p-2 border">{ri.purchase_order.po_kode}</TableCell>
                      <TableCell className="p-2 border">
                        {formatTanggal(ri.created_at)}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {ri.ri_lokasi}
                      </TableCell>
                      <TableCell className="p-2 border">{ri.ri_pic}</TableCell>
                      <TableCell className="p-2 border">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/receive/kode/${encodeURIComponent(ri.ri_kode)}`}
                          >
                            Detail
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Tidak ada RI ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination
            data={filteredRis}
            triggerNext={nextPageRi}
            triggerPageChange={pageChangeRi}
            triggerPrevious={previousPageRi}
            currentPage={currentPageRi}
          />
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
