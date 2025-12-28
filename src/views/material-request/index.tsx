import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/auth";
import type {MRReceive, UserComplete } from "@/types";
import { ClipboardPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateMRForm from "@/components/form/create-mr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { getAllMr } from "@/services/material-request";
import { MyPagination } from "@/components/my-pagination";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatTanggal } from "@/lib/utils";
import { PagingSize } from "@/types/enum";

export default function MaterialRequest() {
  const [user, setUser] = useState<UserComplete | null>(null);
  const [mrs, setMrs] = useState<MRReceive[]>([]);
  const [filteredMrs, setFilteredMrs] = useState<MRReceive[]>([]);
  const [mrToShow, setMrToShow] = useState<MRReceive[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Filtering
  const [tanggalMr, setTanggalMr] = useState<Date>();
  const [pic, setPic] = useState<string>("");
  const [kode, setKode] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();
  const [lokasi, setLokasi] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [dariTanggal, setDariTanggal] = useState<Date>();
  const [sampaiTanggal, setSampaiTanggal] = useState<Date>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function fetchUserDataAndMRs() {
      try {
        const mrResult = await getAllMr();
        setMrs(mrResult);
        setFilteredMrs(mrResult);
        setMrToShow(mrResult.slice(0, PagingSize));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data: ${error.message}`);
        } else {
          toast.error("Gagal mengambil data pengguna atau MR.");
        }
        setUser(null);
      }
    }

    fetchUserDataAndMRs();
  }, [refresh]);

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  function filterMrs() {
    let filtered = mrs;

    if (tanggalMr) {
      filtered = filtered.filter(
        (mr) =>
          new Date(mr.mr_tanggal).toDateString() === tanggalMr.toDateString()
      );
    }
    if (dueDate) {
      filtered = filtered.filter(
        (mr) => new Date(mr.mr_due_date).toDateString() === dueDate.toDateString()
      );
    }
    if (lokasi) {
      filtered = filtered.filter((mr) =>
        mr.mr_lokasi.toLowerCase().includes(lokasi.toLowerCase())
      );
    }
    if (pic) {
      filtered = filtered.filter((mr) =>
        mr.mr_pic.toLowerCase().includes(pic.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter((mr) =>
        mr.mr_status.toLowerCase().includes(status.toLowerCase())
      );
    }

    if (kode) {
      filtered = filtered.filter((mr) =>
        mr.mr_kode.toLowerCase().includes(kode.toLowerCase())
      );
    }
    if (dariTanggal && sampaiTanggal) {
      const dari = new Date(dariTanggal);
      const sampai = new Date(sampaiTanggal);
      filtered = filtered.filter(
        (mr) =>
          new Date(mr.mr_tanggal) >= dari && new Date(mr.mr_tanggal) <= sampai
      );
    }

    setFilteredMrs(filtered);
    setCurrentPage(1); // Reset to first page after filtering
    setMrToShow(filtered.slice(0, PagingSize));
    if (filtered.length === 0) {
      toast.info("Tidak ada Material Request yang sesuai dengan filter.");
    } else {
      toast.success("Filter berhasil diterapkan.");
    }
  }

  function resetFilters() {
    setTanggalMr(undefined);
    setPic("");
    setKode("");
    setDueDate(undefined);
    setLokasi("");
    setStatus("");
    setPriority("");
    setDariTanggal(undefined);
    setSampaiTanggal(undefined);
    setFilteredMrs(mrs);
    setCurrentPage(1);
    setMrToShow(mrs.slice(0, PagingSize));
    toast.success("Filter telah direset.");
  }

  useEffect(() => {
    setMrToShow(
      filteredMrs.slice(
        (currentPage - 1) * PagingSize,
        currentPage * PagingSize
      )
    );
  }, [currentPage]);

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
      {/* Data MR */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Material Request</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            {/* Search by kode */}
            <div className="col-span-12 md:col-span-4 lg:col-span-5">
              <Input
                placeholder="Cari berdasarkan kode"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
              />
            </div>

            {/* Search button */}
            <div className="col-span-12 md:col-span-4 lg:col-span-2">
              <Button className="w-full" onClick={filterMrs}>
                Cari
              </Button>
            </div>

            {/* Filter popover */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter Tambahan
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tanggal MR
                    </label>
                    <DatePicker value={tanggalMr} onChange={setTanggalMr} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <DatePicker value={dueDate} onChange={setDueDate} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lokasi
                    </label>
                    <Input
                      placeholder="Lokasi"
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      PIC
                    </label>
                    <Input
                      placeholder="PIC"
                      value={pic}
                      onChange={(e) => setPic(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <Input
                      placeholder="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <Input
                      placeholder="Priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear filter button */}
            <div className="col-span-12 md:col-span-4 lg:col-span-2">
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
                  <TableHead className="border p-2">No</TableHead>
                  <TableHead className="border p-2">Kode</TableHead>
                  <TableHead className="border p-2">Tanggal MR</TableHead>
                  <TableHead className="border p-2">Due Date</TableHead>
                  <TableHead className="border p-2">Lokasi</TableHead>
                  <TableHead className="border p-2">PIC</TableHead>
                  <TableHead className="border p-2">Status</TableHead>
                  <TableHead className="border p-2">Jumlah Barang</TableHead>
                  <TableHead className="border p-2">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mrToShow.length > 0 ? (
                  mrToShow.map((mr, index) => (
                    <TableRow key={mr.mr_id}>
                      <TableCell className="border p-2">
                        {PagingSize * (currentPage - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="border p-2">{mr.mr_kode}</TableCell>
                      <TableCell className="border p-2">
                        {formatTanggal(mr.mr_tanggal)}
                      </TableCell>
                      <TableCell className="border p-2">
                        {formatTanggal(mr.mr_due_date)}
                      </TableCell>
                      <TableCell className="border p-2">{mr.mr_lokasi}</TableCell>
                      <TableCell className="border p-2">{mr.mr_pic}</TableCell>
                      <TableCell className="border p-2">{mr.mr_status}</TableCell>
                      <TableCell className="border p-2">
                        {mr.details?.length || 0}
                      </TableCell>
                      <TableCell className="border p-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="mr-2"
                          asChild
                        >
                          <Link
                            to={`/mr/kode/${encodeURIComponent(mr.mr_kode)}`}>
                            Detail
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Tidak ada Material Request ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>

        <SectionFooter>
          <MyPagination
            data={filteredMrs}
            triggerNext={nextPage}
            triggerPageChange={(e) => {
              pageChange(e);
            }}
            triggerPrevious={previousPage}
            currentPage={currentPage}
          />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah MR (Hanya untuk role warehouse) */}
      {user?.role === "warehouse" && (
        <SectionContainer span={12}>
          <SectionHeader>Tambah MR Baru</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 border border-border rounded-sm p-2 text-center">
              <CreateMRForm user={user} setRefresh={setRefresh} />
            </div>
          </SectionBody>
          <SectionFooter>
            <Button
              className="w-full flex gap-4"
              type="submit"
              form="create-mr-form"
            >
              Tambah <ClipboardPlus />
            </Button>
          </SectionFooter>
        </SectionContainer>
      )}
    </WithSidebar>
  );
}
