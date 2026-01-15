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
import {
  getMasterCustomers,
  toggleMasterCustomerStatus,
} from "@/services/customer";
import type { MasterCustomer } from "@/types";
import { PagingSize } from "@/types/enum";
import { HousePlus } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import CreateCustomerForm from "@/components/form/create-customer";
import { EditCustomerDialog } from "@/components/dialog/edit-customer";

export default function MasterCustomerPage() {
  const [customers, setCustomers] = useState<MasterCustomer[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await getMasterCustomers();
        if (res) setCustomers(res);
      } catch (error) {
        toast.error("Gagal mengambil data master customer");
      }
    }

    fetchCustomers();
  }, [refresh]);

  return (
    <WithSidebar>
      {/* =======================
          DATA MASTER CUSTOMER
      ======================== */}
      <DataMasterCustomerSection
        customers={customers}
        setRefresh={setRefresh}
      />

      {/* =======================
          TAMBAH CUSTOMER
      ======================== */}
      <SectionContainer span={12}>
        <SectionHeader>Tambah Customer</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 rounded-sm">
            <CreateCustomerForm setRefresh={setRefresh} />
          </div>
        </SectionBody>
        <SectionFooter>
          <Button
            className="w-full flex gap-4"
            type="submit"
            form="create-customer-form"
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
function CustomerColumnsGenerator(
  setRefresh: Dispatch<SetStateAction<boolean>>
) {
  return [
    {
      header: "No Customer",
      accessorKey: "customer_no",
    },
    {
      header: "Nama Customer",
      accessorKey: "customer_name",
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
            ${
              value
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {value ? "AKTIF" : "NON AKTIF"}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessorKey: "aksi",
      cell: (_: any, row: MasterCustomer) => (
        <div className="flex gap-2">
          <EditCustomerDialog customer={row} refresh={setRefresh} />

          <Button
            size="sm"
            variant={row.is_active ? "destructive" : "outline"}
            onClick={async () => {
              await toggleMasterCustomerStatus(row.customer_id!);
              setRefresh((prev) => !prev);
            }}
          >
            {row.is_active ? "Non Aktif" : "Aktifkan"}
          </Button>
        </div>
      ),
    },
  ];
}

/* =========================
   SECTION TABLE
========================= */
function DataMasterCustomerSection({
  customers,
  setRefresh,
}: {
  customers: MasterCustomer[];
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) {
  const [filteredCustomers, setFilteredCustomers] =
    useState<MasterCustomer[]>([]);
  const [tableCustomers, setTableCustomers] =
    useState<MasterCustomer[]>([]);

  const pageSize = PagingSize;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // filter state
  const [customerNo, setCustomerNo] = useState("");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    setFilteredCustomers(customers);
    setTableCustomers(customers.slice(0, pageSize));
    setCurrentPage(1);
  }, [customers]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setTableCustomers(filteredCustomers.slice(start, end));
  }, [currentPage, filteredCustomers]);

  function filterCustomer() {
    let filtered = customers;

    if (customerNo) {
      filtered = filtered.filter((c) =>
        c.customer_no.toLowerCase().includes(customerNo.toLowerCase())
      );
    }

    if (customerName) {
      filtered = filtered.filter((c) =>
        c.customer_name.toLowerCase().includes(customerName.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }

  function resetFilter() {
    setCustomerNo("");
    setCustomerName("");
    setFilteredCustomers(customers);
    setCurrentPage(1);
  }

  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Customer</SectionHeader>
      <SectionBody className="grid grid-cols-12 gap-2">
        <div className="flex flex-col gap-4 col-span-12">
          {/* FILTER */}
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-5">
              <Input
                placeholder="Cari berdasarkan no customer"
                value={customerNo}
                onChange={(e) => setCustomerNo(e.target.value)}
              />
            </div>

            <div className="col-span-12 md:col-span-2">
              <Button className="w-full" onClick={filterCustomer}>
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
                      Nama Customer
                    </label>
                    <Input
                      placeholder="nama customer"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
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
            data={tableCustomers}
            columns={CustomerColumnsGenerator(setRefresh)}
            page={currentPage}
          />
        </div>
      </SectionBody>

      <SectionFooter>
        <MyPagination
          data={filteredCustomers}
          currentPage={currentPage}
          triggerNext={() => setCurrentPage((p) => p + 1)}
          triggerPrevious={() => setCurrentPage((p) => p - 1)}
          triggerPageChange={(page) => setCurrentPage(page)}
        />
      </SectionFooter>
    </SectionContainer>
  );
}
