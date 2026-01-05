import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import type { PO, PurchaseRequest, UserComplete, UserDb } from "@/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

import { cn } from "@/lib/utils";
import { getPr } from "@/services/purchase-request";
import { createPO } from "@/services/purchase-order";
import { DatePicker } from "../date-picker";

interface CreatePOFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}
function toMysqlDatetime(date: Date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export default function CreatePOForm({ user, setRefresh }: CreatePOFormProps) {
  const [open, setOpen] = useState(false);
  const [prList, setPrList] = useState<PurchaseRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | undefined>();
  const [estimasi, setEstimasi] = useState<Date | undefined>();
  const [status, setStatus] = useState("pending");
  const [kode, setKode] = useState(""); // ✅ Controlled input
  const [keterangan, setKeterangan] = useState(""); // ✅ Controlled textarea

  // ===============================
  // FETCH PR
  // ===============================
  useEffect(() => {
    async function fetchPR() {
      try {
        const res = await getPr(); // ✅ Ganti dari getAllPr ke getPr
        console.log("📦 Data PR dari API:", res);
        setPrList(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching PR:", err);
        toast.error("Gagal mengambil data PR");
        setPrList([]);
      }
    }
    fetchPR();
  }, []);

  // ===============================
  // SUBMIT
  // ===============================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!estimasi) {
      toast.error("Tanggal estimasi wajib diisi");
      return;
    }

    if (!selectedPR) {
      toast.error("Referensi PR wajib dipilih");
      return;
    }

    if (!kode.trim()) {
      toast.error("Kode PO wajib diisi");
      return;
    }

    // ✅ Tidak perlu FormData lagi, ambil dari state
    const payload: PO = {
      po_kode: kode.trim(),
      pr_id: selectedPR.pr_id!,
      po_tanggal: toMysqlDatetime(new Date()),
      po_estimasi: toMysqlDatetime(estimasi),
      po_keterangan: keterangan.trim(),
      po_status: status,
      po_pic: user.nama,

      details: selectedPR.details.map((d) => ({
        part_id: d.part_id,
        dtl_po_part_number: d.dtl_pr_part_number,
        dtl_po_part_name: d.dtl_pr_part_name,
        dtl_po_satuan: d.dtl_pr_satuan,
        dtl_po_qty: d.dtl_pr_qty,
      })),
       created_at: toMysqlDatetime(new Date()),
       updated_at: toMysqlDatetime(new Date()),
    };

    console.log("📤 Payload yang dikirim:", payload);

    try {
      await createPO(payload);
      toast.success("Purchase Order berhasil dibuat");
      
      // ✅ Reset semua state (tidak pakai e.currentTarget.reset())
      setKode("");
      setKeterangan("");
      setSelectedPR(undefined);
      setEstimasi(undefined);
      setStatus("pending");
      setOpen(false);
      
      // ✅ Refresh tabel setelah reset
      setRefresh((prev) => !prev);
    } catch (err: any) {
      console.error("Error creating PO:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Gagal membuat PO";
      toast.error(errorMsg);
    }
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <form
      id="create-po-form"
      onSubmit={handleSubmit}
      className="grid grid-cols-12 gap-4"
    >
      {/* KIRI */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Kode PO</Label>
          <Input 
            name="kode" 
            placeholder="Masukkan kode PO" 
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Referensi PR</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between"
              >
                {/* ✅ Ubah dari selectedPR.kode menjadi selectedPR.pr_kode */}
                {selectedPR ? selectedPR.pr_kode : "Pilih PR"}
                <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Cari kode PR..." />
                <CommandList>
                  <CommandEmpty>Tidak ada PR tersedia</CommandEmpty>
                  <CommandGroup>
                    {prList.length > 0 ? (
                      prList.map((pr) => (
                        <CommandItem
                          key={pr.pr_id || pr.pr_kode}
                          value={pr.pr_kode}
                          onSelect={(currentValue) => {
                            console.log("✅ Selected:", currentValue, pr);
                            setSelectedPR(pr);
                            setOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPR?.pr_kode === pr.pr_kode
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{pr.pr_kode}</span>
                            <span className="text-xs text-muted-foreground">
                              {pr.pr_lokasi} • {pr.pr_tanggal}
                            </span>
                          </div>
                        </CommandItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Memuat data PR...
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* KANAN */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Select 
            name="status" 
            required 
            value={status} 
            onValueChange={setStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="purchased">Purchased</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Tanggal Estimasi</Label>
          <DatePicker value={estimasi} onChange={setEstimasi} />
        </div>
      </div>

      {/* KETERANGAN */}
      <div className="col-span-12">
        <Label>Keterangan</Label>
        <Textarea 
          name="keterangan" 
          placeholder="Keterangan (opsional)..."
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
        />
      </div>

      {/* TABLE ITEM PR */}
      <div className="col-span-12">
        <Label className="mb-2 block">
          {/* ✅ Ubah dari selectedPR.kode */}
          Item dari PR {selectedPR ? `(${selectedPR.pr_kode})` : ""}
        </Label>
        <div className="border rounded-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border [&>*]:border">
                <TableHead className="font-semibold text-center">No</TableHead>
                <TableHead className="font-semibold text-center">Part Number</TableHead>
                <TableHead className="font-semibold text-center">Part Name</TableHead>
                <TableHead className="font-semibold text-center">Satuan</TableHead>
                <TableHead className="font-semibold text-center">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* ✅ Ubah dari order_item menjadi details */}
              {selectedPR?.details && selectedPR.details.length > 0 ? (
                selectedPR.details.map((item, i) => (
                  <TableRow key={i} className="border [&>*]:border">
                    <TableCell className="text-center">{i + 1}</TableCell>
                    {/* ✅ Sesuaikan field names dengan PurchaseRequest */}
                    <TableCell className="text-start">{item.dtl_pr_part_number}</TableCell>
                    <TableCell className="text-start">{item.dtl_pr_part_name}</TableCell>
                    <TableCell className="text-center">{item.dtl_pr_satuan}</TableCell>
                    <TableCell className="text-center">{item.dtl_pr_qty}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {selectedPR 
                      ? "Tidak ada item dalam PR ini" 
                      : "Pilih PR terlebih dahulu untuk melihat item"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </form>
  );
}