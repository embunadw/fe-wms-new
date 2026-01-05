import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import CreatePOForm from "@/components/form/create-po";
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
import { formatTanggal } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth";
import { getPo } from "@/services/purchase-order";
import type { POHeader, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { Plus } from "lucide-react";
import { useEffect, useState, Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("❌ Error in CreatePOForm:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-sm">
          <p className="text-red-800 font-semibold mb-2">
            ⚠️ Error loading form
          </p>
          <p className="text-sm text-red-600 mb-2">
            {this.state.error?.message || "Unknown error"}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Coba Lagi
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function PurchaseOrder() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [user, setUser] = useState<UserComplete | null>(null);
  const [pos, setPos] = useState<POHeader[]>([]);
  const [filteredPos, setFilteredPos] = useState<POHeader[]>([]);
  const [poToShow, setPoToShow] = useState<POHeader[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State untuk Filtering
  const [kodePo, setKodePo] = useState<string>("");
  const [kodePr, setKodePr] = useState<string>("");
  const [status, setStatus] = useState<string>("");

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

  useEffect(() => {
    async function fetchAllPOs() {
      try {
        const poResult = await getPo();
        setPos(poResult || []);
        setFilteredPos(poResult || []);
      } catch (error) {
        setPos([]);
        setFilteredPos([]);
        toast.error(
          `Gagal mengambil data PO: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    fetchAllPOs();
  }, [refresh]);

  useEffect(() => {
    let filtered = pos;

    if (kodePo) {
      filtered = filtered.filter((po) =>
        po.kode.toLowerCase().includes(kodePo.toLowerCase())
      );
    }

    if (kodePr) {
      filtered = filtered.filter((po) =>
        po.kode_pr.toLowerCase().includes(kodePr.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((po) => po.status === status);
    }

    setFilteredPos(filtered);
    setCurrentPage(1);
  }, [pos, kodePo, kodePr, status]);

  useEffect(() => {
    if (!filteredPos || !Array.isArray(filteredPos)) {
      setPoToShow([]);
      return;
    }

    const startIndex = (currentPage - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setPoToShow(filteredPos.slice(startIndex, endIndex));
  }, [filteredPos, currentPage]);

  function resetFilters() {
    setKodePo("");
    setKodePr("");
    setStatus("");
    toast.success("Filter telah direset.");
  }

  function nextPage() {
    setCurrentPage((prev) => prev + 1);
  }

  function previousPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function pageChange(page: number) {
    setCurrentPage(page);
  }

  // DEBUG: Log untuk melihat kondisi render
  console.log("🔍 Render check:", {
    userExists: !!user,
    userRole: user?.role,
    canCreate: user?.role === "warehouse" || user?.role === "purchasing"
  });

  return (
    <WithSidebar>
      {/* Data PO */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Purchase Order</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-6 lg:col-span-7">
              <Input
                id="search-kode-po"
                placeholder="Ketik kode PO untuk memfilter..."
                value={kodePo}
                onChange={(e) => setKodePo(e.target.value)}
              />
            </div>

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
                      <Label htmlFor="filter-kode-pr">Kode PR</Label>
                      <Input
                        id="filter-kode-pr"
                        placeholder="Cari kode PR..."
                        value={kodePr}
                        onChange={(e) => setKodePr(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="purchased">Purchased</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

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
                    <TableRow key={po.id}>
                      <TableCell className="p-2 border">
                        {PagingSize * (currentPage - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="p-2 border">{po.kode}</TableCell>
                      <TableCell className="p-2 border">
                        {po.kode_pr || '-'}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {formatTanggal(po.created_at)}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {formatTanggal(po.tanggal_estimasi)}
                      </TableCell>
                      <TableCell className="p-2 border">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          po.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : po.status === 'purchased'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {po.status === 'pending' ? 'Pending' : 
                           po.status === 'purchased' ? 'Purchased' : 'Received'}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 border">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/po/kode/${encodeURIComponent(po.kode)}`}>
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
                      Tidak ada Purchase Order ditemukan.
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
            triggerNext={nextPage}
            triggerPageChange={pageChange}
            triggerPrevious={previousPage}
            currentPage={currentPage}
          />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah PO - DENGAN ERROR HANDLING */}
      {!user ? (
        // Loading state
        <SectionContainer span={12}>
          <SectionHeader>Tambah PO Baru</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 p-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Memuat informasi user...</p>
            </div>
          </SectionBody>
        </SectionContainer>
      ) : user.role === "warehouse" || user.role === "purchasing" ? (
        // User memiliki akses
        <SectionContainer span={12}>
          <SectionHeader>Tambah PO Baru</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 border border-border rounded-sm p-2">
              <ErrorBoundary>
                <CreatePOForm setRefresh={setRefresh} user={user} />
              </ErrorBoundary>
            </div>
          </SectionBody>
          <SectionFooter>
            <Button
              className="w-full flex gap-4"
              type="submit"
              form="create-po-form"
            >
              Tambah <Plus />
            </Button>
          </SectionFooter>
        </SectionContainer>
      ) : (
        // User tidak memiliki akses
        <SectionContainer span={12}>
          <SectionHeader>Tambah PO Baru</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 p-8 text-center border border-dashed rounded-sm">
              <p className="text-muted-foreground mb-2">
                Anda tidak memiliki akses untuk menambah PO
              </p>
              <p className="text-sm text-muted-foreground">
                Role Anda: <span className="font-mono font-semibold">{user.role}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                (Hanya warehouse dan purchasing yang dapat menambah PO)
              </p>
            </div>
          </SectionBody>
        </SectionContainer>
      )}
    </WithSidebar>
  );
}