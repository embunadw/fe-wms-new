import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import CreatePRForm from "@/components/form/create-pr";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/services/auth";
import { getPr } from "@/services/purchase-request";
import type { PurchaseRequest, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function PurchaseRequest() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [user, setUser] = useState<UserComplete | null>(null);
  const [prs, setPrs] = useState<PurchaseRequest[]>([]);
  const [filteredPrs, setFilteredPrs] = useState<PurchaseRequest[]>([]);
  const [prToShow, setPrToShow] = useState<PurchaseRequest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // --- State untuk Filtering ---
  const [kode, setKode] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [lokasi, setLokasi] = useState<string>("");
  const [pic, setPic] = useState<string>("");
  const [partNumber, setPartNumber] = useState<string>(""); // Filter tambahan

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchAllPRs() {
      try {
        const prResult = await getPr();
        
        setPrs(prResult);
        console.log("getAllPr result:", prResult);
      } catch (error) {
        toast.error(
          `Gagal mengambil data PR: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    fetchAllPRs();
  }, [refresh]);

  // --- useEffect untuk Filtering Otomatis ---
  useEffect(() => {
    let filtered = prs;

    if (kode) {
      filtered = filtered.filter((pr) =>
        pr.pr_kode.toLowerCase().includes(kode.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter((pr) => pr.pr_status === status);
    }
    if (lokasi) {
      filtered = filtered.filter((pr) =>
        pr.pr_lokasi.toLowerCase().includes(lokasi.toLowerCase())
      );
    }
    if (pic) {
      filtered = filtered.filter((pr) =>
        pr.pr_pic.toLowerCase().includes(pic.toLowerCase())
      );
    }
    // Filter berdasarkan part number di dalam order_item
    if (partNumber) {
      filtered = filtered.filter(
        (pr) =>
          Array.isArray(pr.details) &&
          pr.details.some((item) =>
            item.dtl_pr_part_number
              ?.toLowerCase()
              .includes(partNumber.toLowerCase())
          )
      );
    }

    setFilteredPrs(filtered);
    setCurrentPage(1); // Reset ke halaman pertama setiap kali filter berubah
  }, [prs, kode, status, lokasi, pic, partNumber]); // <-- Semua state filter jadi dependensi

  // --- useEffect untuk Mengatur Paginasi ---
  useEffect(() => {
     if (!Array.isArray(filteredPrs) || filteredPrs.length === 0) {
    setPrToShow([]);
    return;
  }
    const startIndex = (currentPage - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setPrToShow(filteredPrs.slice(startIndex, endIndex));
  }, [filteredPrs, currentPage]);

  function resetFilters() {
    setKode("");
    setStatus("");
    setLokasi("");
    setPic("");
    setPartNumber("");
    toast.success("Filter telah direset.");
  }

  // Fungsi paginasi tidak perlu diubah
  function nextPage() {
    setCurrentPage((prev) => prev + 1);
  }

  function previousPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function pageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <WithSidebar>
      {/* Data PR */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Purchase Request</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            {/* Search by kode */}
            <div className="col-span-12 md:col-span-6 lg:col-span-7">
              <Input
                id="search-kode"
                placeholder="Ketik kode PR untuk memfilter..."
                value={kode}
                onChange={(e) => setKode(e.target.value)}
              />
            </div>

            {/* Filter popover */}
            <div className="col-span-6 md:col-span-3 lg:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter Tambahan
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Filter Lanjutan
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Saring data berdasarkan kriteria lain.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filter-part-number">Nomor Part</Label>
                      <Input
                        id="filter-part-number"
                        placeholder="Cari nomor part..."
                        value={partNumber}
                        onChange={(e) => setPartNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="close">Close</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-lokasi">Lokasi</Label>
                      <Input
                        id="filter-lokasi"
                        placeholder="Cari lokasi..."
                        value={lokasi}
                        onChange={(e) => setLokasi(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-pic">PIC</Label>
                      <Input
                        id="filter-pic"
                        placeholder="Cari PIC..."
                        value={pic}
                        onChange={(e) => setPic(e.target.value)}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear filter button */}
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={resetFilters}
              >
                Hapus Filter
              </Button>
            </div>
          </div>
          <div className="col-span-12 border rounded-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 border">No</TableHead>
                  <TableHead className="p-2 border">Kode</TableHead>
                  <TableHead className="p-2 border">Status</TableHead>
                  <TableHead className="p-2 border">Lokasi</TableHead>
                  <TableHead className="p-2 border">PIC</TableHead>
                  <TableHead className="p-2 border">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prToShow.length > 0 ? (
                  prToShow.map((pr, index) => (
                    <TableRow key={pr.pr_id}>
                      <TableCell className="p-2 border">
                        {PagingSize * (currentPage - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="p-2 border">{pr.pr_kode}</TableCell>
                      <TableCell className="p-2 border">{pr.pr_status}</TableCell>
                      <TableCell className="p-2 border">{pr.pr_lokasi}</TableCell>
                      <TableCell className="p-2 border">{pr.pr_pic}</TableCell>
                      <TableCell className="p-2 border">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/pr/kode/${encodeURIComponent(pr.pr_kode)}`}>
                            Detail
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6} // Disesuaikan dengan jumlah kolom
                      className="p-4 text-center text-muted-foreground"
                    >
                      Tidak ada Purchase Request ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>

        <SectionFooter>
          <MyPagination
            data={filteredPrs}
            triggerNext={nextPage}
            triggerPageChange={pageChange}
            triggerPrevious={previousPage}
            currentPage={currentPage}
          />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah (tidak ada perubahan) */}
      {user?.role === "warehouse" || user?.role === "purchasing" ? (
        <SectionContainer span={12}>
          <SectionHeader>Tambah PR Baru</SectionHeader>
          <SectionBody>
            <div className="col-span-12 border border-border rounded-sm p-2 text-center">
              <CreatePRForm setRefresh={setRefresh} user={user} />
            </div>
          </SectionBody>
          <SectionFooter>
            <Button
              className="w-full flex gap-4"
              type="submit"
              form="create-pr-form"
            >
              Tambah <Plus />
            </Button>
          </SectionFooter>
        </SectionContainer>
      ) : (
        ""
      )}
    </WithSidebar>
  );
}
