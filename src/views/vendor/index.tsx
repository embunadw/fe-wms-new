import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { QuickTable } from "@/components/quick-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatTanggal } from "@/lib/utils";
import {
  getMasterVendors,
  toggleMasterVendorStatus,
} from "@/services/vendor";
import type { MasterVendor } from "@/types";
import { PagingSize } from "@/types/enum";
import { HousePlus } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import CreateVendorForm from "@/components/form/create-vendor";
import { EditVendorDialog } from "@/components/dialog/edit-vendor";

export default function MasterVendorPage() {
  const [vendors, setVendors] = useState<MasterVendor[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await getMasterVendors();
        if (res) setVendors(res);
      } catch (error) {
        toast.error("Gagal mengambil data master vendor");
      }
    }

    fetchVendors();
  }, [refresh]);

  return (
    <WithSidebar>
      {/* =======================
          DATA MASTER VENDOR
      ======================== */}
      <DataMasterVendorSection
        vendors={vendors}
        setRefresh={setRefresh}
      />

      {/* =======================
          TAMBAH VENDOR
      ======================== */}
      <SectionContainer span={12}>
        <SectionHeader>Tambah Vendor</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 rounded-sm">
            <CreateVendorForm setRefresh={setRefresh} />
          </div>
        </SectionBody>
        <SectionFooter>
          <Button
            className="w-full flex gap-4"
            type="submit"
            form="create-vendor-form"
          >
            Tambah <HousePlus />
          </Button>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}

/* =========================
   COLUMNS
========================= */
function VendorColumnsGenerator(
  setRefresh: Dispatch<SetStateAction<boolean>>
) {
  return [
    {
      header: "No Vendor",
      accessorKey: "vendor_no",
    },
    {
      header: "Nama Vendor",
      accessorKey: "vendor_name",
    },
    {
      header: "Telepon",
      accessorKey: "telephone",
    },
    {
      header: "Kontak",
      accessorKey: "contact_name",
    },
{
  header: "Status",
  accessorKey: "is_active",
  cell: (value: boolean) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold
        ${value
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"}
      `}
    >
      {value ? "AKTIF" : "NON AKTIF"}
    </span>
  ),
},

    // {
    //   header: "Created At",
    //   accessorKey: "created_at",
    //   cell: (value: any) => formatTanggal(value),
    // },
{
  header: "Aksi",
  accessorKey: "aksi",
  cell: (_: any, row: MasterVendor) => (
    <div className="flex gap-2">
      <EditVendorDialog vendor={row} refresh={setRefresh} />

      <Button
        size="sm"
        variant={row.is_active ? "destructive" : "outline"}
        onClick={async () => {
          await toggleMasterVendorStatus(row.vendor_id!);
          setRefresh((prev) => !prev);
        }}
      >
        {row.is_active ? "Non Aktif" : "Aktifasi"}
      </Button>
    </div>
  ),
},

  ];
}

/* =========================
   SECTION TABLE
========================= */
function DataMasterVendorSection({
  vendors,
  setRefresh,
}: {
  vendors: MasterVendor[];
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) {
  const [filteredVendors, setFilteredVendors] =
    useState<MasterVendor[]>([]);
  const [tableVendors, setTableVendors] =
    useState<MasterVendor[]>([]);

  const pageSize = PagingSize;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // filter state
  const [vendorNo, setVendorNo] = useState("");
  const [vendorName, setVendorName] = useState("");

  useEffect(() => {
    setFilteredVendors(vendors);
    setTableVendors(vendors.slice(0, pageSize));
    setCurrentPage(1);
  }, [vendors]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setTableVendors(filteredVendors.slice(start, end));
  }, [currentPage, filteredVendors]);

  function filterVendor() {
    let filtered = vendors;

    if (vendorNo) {
      filtered = filtered.filter((v) =>
        v.vendor_no.toLowerCase().includes(vendorNo.toLowerCase())
      );
    }

    if (vendorName) {
      filtered = filtered.filter((v) =>
        v.vendor_name.toLowerCase().includes(vendorName.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
    setCurrentPage(1);
  }

  function resetFilter() {
    setVendorNo("");
    setVendorName("");
    setFilteredVendors(vendors);
    setCurrentPage(1);
  }

  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Vendor</SectionHeader>
      <SectionBody className="grid grid-cols-12 gap-2">
        <div className="flex flex-col gap-4 col-span-12">
          {/* FILTER */}
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-5">
              <Input
                placeholder="Cari berdasarkan no vendor"
                value={vendorNo}
                onChange={(e) => setVendorNo(e.target.value)}
              />
            </div>

            <div className="col-span-12 md:col-span-2">
              <Button className="w-full" onClick={filterVendor}>
                Cari
              </Button>
            </div>

            <div className="col-span-12 md:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter Tambahan
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Nama Vendor
                    </label>
                    <Input
                      placeholder="nama vendor"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-12 md:col-span-2">
              <Button
                className="w-full"
                variant="destructive"
                onClick={resetFilter}
              >
                Hapus Filter
              </Button>
            </div>
          </div>

          <QuickTable
            data={tableVendors}
            columns={VendorColumnsGenerator(setRefresh)}
            page={currentPage}
          />
        </div>
      </SectionBody>

      <SectionFooter>
        <MyPagination
          data={filteredVendors}
          currentPage={currentPage}
          triggerNext={() => setCurrentPage((p) => p + 1)}
          triggerPrevious={() => setCurrentPage((p) => p - 1)}
          triggerPageChange={(page) => setCurrentPage(page)}
        />
      </SectionFooter>
    </SectionContainer>
  );
}
