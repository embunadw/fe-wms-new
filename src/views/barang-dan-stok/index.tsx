import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { EditStockDialog } from "@/components/dialog/edit-stock";
import { EditPartDialog } from "@/components/dialog/edit-part";
import CreateMasterPartForm from "@/components/form/create-master-part";
import { MyPagination } from "@/components/my-pagination";
import { QuickTable } from "@/components/quick-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTanggal } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth";
import { getMasterParts } from "@/services/master-part";
import { getAllStocks } from "@/services/stock";
import type { MasterPart, Stock, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { HousePlus } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

/* =========================
   MAIN PAGE
========================= */
export default function BarangDanStok() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [masterParts, setMasterParts] = useState<MasterPart[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState<UserComplete | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getCurrentUser();
        setUser(res);
      } catch {
        toast.error("Gagal mengambil data user");
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [mp, stk] = await Promise.all([
          getMasterParts(),
          getAllStocks(),
        ]);
        setMasterParts(mp);
        setStocks(stk);
      } catch {
        toast.error("Gagal mengambil data");
      }
    }

    fetchData();
  }, [user, refresh]);

  return (
    <WithSidebar>
      <DataStokBarangSection
        stocks={stocks}
        lokasiUser={user?.lokasi ?? ""}
        setRefresh={setRefresh}
      />

      <DataMasterPartSection
        masterParts={masterParts}
        setRefresh={setRefresh}
      />

      <SectionContainer span={12}>
        <SectionHeader>Tambah Barang</SectionHeader>
        <SectionBody>
          <CreateMasterPartForm setRefresh={setRefresh} />
        </SectionBody>
        <SectionFooter>
          <Button
            type="submit"
            form="create-master-part-form"
            className="w-full flex gap-2"
          >
            Tambah <HousePlus />
          </Button>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}

/* =========================
   MASTER PART
========================= */
function MasterPartColumns(setRefresh: Dispatch<SetStateAction<boolean>>) {
  return [
    { header: "Part Number", accessorKey: "part_number" },
    { header: "Part Name", accessorKey: "part_name" },
    { header: "Satuan", accessorKey: "part_satuan" },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (v: any) => formatTanggal(v),
    },
    {
      header: "Updated At",
      accessorKey: "updated_at",
      cell: (v: any) => formatTanggal(v),
    },
    {
      header: "Aksi",
      accessorKey: "aksi",
      cell: (_: any, row: MasterPart) => (
        <EditPartDialog refresh={setRefresh} part={row} />
      ),
    },
  ];
}

function DataMasterPartSection({
  masterParts,
  setRefresh,
}: {
  masterParts: MasterPart[];
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = masterParts.filter((mp) =>
    mp.part_number.toLowerCase().includes(search.toLowerCase())
  );

  const paged = filtered.slice(
    (page - 1) * PagingSize,
    page * PagingSize
  );

  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Barang</SectionHeader>
      <SectionBody className="space-y-4">
        <Input
          placeholder="Cari part number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <QuickTable
          data={paged}
          columns={MasterPartColumns(setRefresh)}
          page={page}
        />
      </SectionBody>
      <SectionFooter>
        <MyPagination
          data={filtered}
          currentPage={page}
          triggerNext={() => setPage((p) => p + 1)}
          triggerPrevious={() => setPage((p) => p - 1)}
          triggerPageChange={setPage}
        />
      </SectionFooter>
    </SectionContainer>
  );
}

/* =========================
   STOCK
========================= */
function DataStokBarangSection({
  stocks,
  lokasiUser,
  setRefresh,
}: {
  stocks: Stock[];
  lokasiUser: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) {
  const [page, setPage] = useState(1);
  const [pn, setPn] = useState("");

  const data = stocks
    .filter(
      (s) =>
        s.stk_location?.toLowerCase() === lokasiUser.toLowerCase()
    )
    .filter((s) =>
      s.barang?.part_number
        ?.toLowerCase()
        .includes(pn.toLowerCase())
    )
    .map((s) => ({
      ...s,
      part_number: s.barang?.part_number ?? "-",
      part_name: s.barang?.part_name ?? "-",
      part_satuan: s.barang?.part_satuan ?? "-",
    }));

  const paged = data.slice(
    (page - 1) * PagingSize,
    page * PagingSize
  );

  const columns = [
    { header: "Part Number", accessorKey: "part_number" },
    { header: "Part Name", accessorKey: "part_name" },
    { header: "Satuan", accessorKey: "part_satuan" },
    { header: "Lokasi", accessorKey: "stk_location" },
    { header: "Qty", accessorKey: "stk_qty" },
    {
      header: "Aksi",
      accessorKey: "aksi",
      cell: (_: any, row: Stock) => (
        <EditStockDialog refresh={setRefresh} stock={row} />
      ),
    },
  ];

  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Stok Barang</SectionHeader>
      <SectionBody className="space-y-4">
        <Input
          placeholder="Cari part number"
          value={pn}
          onChange={(e) => setPn(e.target.value)}
        />

        <QuickTable data={paged} columns={columns} page={page} />
      </SectionBody>
      <SectionFooter>
        <MyPagination
          data={data}
          currentPage={page}
          triggerNext={() => setPage((p) => p + 1)}
          triggerPrevious={() => setPage((p) => p - 1)}
          triggerPageChange={setPage}
        />
      </SectionFooter>
    </SectionContainer>
  );
}
