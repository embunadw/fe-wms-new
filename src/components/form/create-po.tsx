import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import type { PO, PR, UserComplete, UserDb } from "@/types";

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
import { getAllPr } from "@/services/purchase-request";
import { createPO } from "@/services/purchase-order";
import { DatePicker } from "../date-picker";

interface CreatePOFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreatePOForm({ user, setRefresh }: CreatePOFormProps) {
  const [open, setOpen] = useState(false);
  const [prList, setPrList] = useState<PR[]>([]);
  const [selectedPR, setSelectedPR] = useState<PR | undefined>();
  const [estimasi, setEstimasi] = useState<Date | undefined>();

  // ===============================
  // FETCH PR
  // ===============================
  useEffect(() => {
    async function fetchPR() {
      try {
        const res = await getAllPr();
        // Pastikan res adalah array, jika tidak set ke empty array
        setPrList(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching PR:", err);
        toast.error("Gagal mengambil data PR");
        setPrList([]); // Set ke empty array jika error
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

    const formData = new FormData(e.currentTarget);

    const payload: PO = {
      kode: formData.get("kode") as string,
      kode_pr: selectedPR.kode,
      tanggal_estimasi: estimasi.toISOString(),
      pic: user.nama,
      status: formData.get("status") as string,
      keterangan: (formData.get("keterangan") as string) || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await createPO(payload);
      toast.success("Purchase Order berhasil dibuat");
      setRefresh((prev) => !prev);
      e.currentTarget.reset();
      setSelectedPR(undefined);
      setEstimasi(undefined);
    } catch (err: any) {
      console.error("Error creating PO:", err);
      toast.error(err?.message || "Gagal membuat PO");
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
          <Input name="kode" placeholder="Masukkan kode PO" required />
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
                {selectedPR ? selectedPR.kode : "Pilih PR"}
                <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Cari kode PR..." />
                <CommandList>
                  <CommandEmpty>Tidak ada PR tersedia</CommandEmpty>
                  <CommandGroup>
                    {prList && prList.length > 0 ? (
                      prList.map((pr) => (
                        <CommandItem
                          key={pr.kode}
                          value={pr.kode}
                          onSelect={() => {
                            setSelectedPR(pr);
                            setOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPR?.kode === pr.kode
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {pr.kode}
                        </CommandItem>
                      ))
                    ) : null}
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
          <Select name="status" required defaultValue="pending">
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
        <Textarea name="keterangan" placeholder="Keterangan (opsional)..." />
      </div>

      {/* TABLE ITEM PR */}
      <div className="col-span-12">
        <Label className="mb-2 block">
          Item dari PR {selectedPR ? `(${selectedPR.kode})` : ""}
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
              {selectedPR?.order_item && selectedPR.order_item.length > 0 ? (
                selectedPR.order_item.map((item, i) => (
                  <TableRow key={i} className="border [&>*]:border">
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell className="text-start">{item.part_number}</TableCell>
                    <TableCell className="text-start">{item.part_name}</TableCell>
                    <TableCell className="text-center">{item.satuan}</TableCell>
                    <TableCell className="text-center">{item.qty}</TableCell>
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