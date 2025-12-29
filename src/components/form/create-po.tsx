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
        setPrList(res);
      } catch (err) {
        toast.error("Gagal mengambil data PR");
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
          <Input name="kode" required />
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

            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Cari kode PR..." />
                <CommandList>
                  <CommandEmpty>Tidak ada PR</CommandEmpty>
                  <CommandGroup>
                    {prList.map((pr) => (
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
                    ))}
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
          <Select name="status" required>
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
        <Textarea name="keterangan" placeholder="Opsional..." />
      </div>

      {/* TABLE ITEM PR */}
      <div className="col-span-12">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Part Name</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedPR?.order_item?.length ? (
              selectedPR.order_item.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.part_number}</TableCell>
                  <TableCell>{item.part_name}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted">
                  Belum ada item
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </form>
  );
}
