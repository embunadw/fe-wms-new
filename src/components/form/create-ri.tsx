import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { POReceive, PurchaseRequest, UserComplete, UserDb } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { Button } from "../ui/button";
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
import { getPrByKode } from "@/services/purchase-request";
import { Textarea } from "../ui/textarea";
import { createRI, getPurchasedPO } from "@/services/receive-item";
import { LokasiList } from "@/types/enum";
import { DatePicker } from "../date-picker";

interface CreatePOFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateRIForm({ user, setRefresh }: CreatePOFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [po, setPO] = useState<POReceive[]>([]);
  const [filteredPO, setFilteredPO] = useState<POReceive[]>([]);
  const [selectedPO, setSelectedPO] = useState<POReceive>();
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest>();
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date());

  // Fetch PR
  useEffect(() => {
    async function fetchPR(kode: string) {
      try {
        const res = await getPrByKode(kode);
        if (!res) {
          toast.error(`PR dengan kode ${kode} tidak ditemukan.`);
          return;
        }
        setSelectedPR(res);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data PR: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data PR.");
        }
      }
    }

    if (!selectedPO) return;
    fetchPR(selectedPO.pr_id);
  }, [selectedPO]);

  // Fetch PR
  useEffect(() => {
    async function fetchPR() {
      try {
        const res = await getPurchasedPO();
        setPO(res);
        setFilteredPO(res);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data PO: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data PO.");
        }
      }
    }

    fetchPR();
  }, []);

 async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!selectedPO) {
    toast.error("Pilih PO terlebih dahulu.");
    return;
  }

  if (!selectedPR) {
    toast.error("PR tidak ditemukan untuk PO ini.");
    return;
  }

  if (!tanggal) {
    toast.error("Tanggal harus diisi.");
    return;
  }

  const formData = new FormData(event.currentTarget);

  const ri_kode = formData.get("kode") as string;
  const ri_lokasi = formData.get("penerima") as string;
  const ri_keterangan = formData.get("keterangan") as string;

  if (!ri_kode) {
    toast.error("Kode RI tidak boleh kosong.");
    return;
  }

  if (!ri_lokasi) {
    toast.error("Lokasi tidak boleh kosong.");
    return;
  }

  const details = selectedPR.details.map((d) => ({
    part_id: d.part_id,
    mr_id: d.mr_id,
    dtl_ri_part_number: d.dtl_pr_part_number,
    dtl_ri_part_name: d.dtl_pr_part_name,
    dtl_ri_satuan: d.dtl_pr_satuan,
    dtl_ri_qty: d.dtl_pr_qty,
  }));

  const payload = {
    ri_kode,
    po_id: selectedPO.po_id,
    ri_lokasi,
    ri_tanggal: tanggal.toISOString().slice(0, 10),
    ri_keterangan,
    ri_pic: user.nama,
    details,
  };

  try {
    const res = await createRI(payload);

    if (res) {
      toast.success("Receive item berhasil dibuat.");
      setRefresh((p) => !p);
      event.currentTarget.reset();
      setSelectedPO(undefined);
      setSelectedPR(undefined);
    } else {
      toast.error("Gagal membuat RI.");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? "Gagal create RI.");
  }
}


  return (
    <form
      onSubmit={handleSubmit}
      id="create-ri-form"
      className="grid grid-cols-12 gap-4"
    >
      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Kode PO */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kode">Kode RI</Label>
          <Input name="kode" className="lg:tracking-wider" required />
        </div>

        {/* Combobox Referensi PO */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kodePO">Receive item dari PO</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("col-span-12 lg:col-span-4 justify-between")}
              >
                {selectedPO
                  ? po.find((po: POReceive) => po.po_kode === selectedPO?.po_kode)?.po_kode
                  : "Cari kode PO..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Cari kode PO..." />
                <CommandList>
                  <CommandEmpty>Tidak ada.</CommandEmpty>
                  <CommandGroup>
                    {filteredPO?.map((m) => (
                      <CommandItem
                        key={m.po_kode}
                        value={m.po_kode}
                        onSelect={(currentValue) => {
                          setSelectedPO(
                            po.find((m) => m.po_kode === currentValue)
                          );
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPO?.po_kode === m.po_kode
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {`${m.po_kode}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Gudang Penerima */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="penerima">PO diterima di gudang</Label>
          <div className="flex items-center">
            <Select required name="penerima">
              <SelectTrigger className="w-full" name="penerima" id="penerima">
                <SelectValue placeholder="Pilih penerima" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lokasi</SelectLabel>
                  {LokasiList.map((lokasi) => {
                    if (lokasi.nama === "unassigned") return null;
                    return (
                      <SelectItem key={lokasi.kode} value={lokasi.nama}>
                        {lokasi.nama}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Tanggal RI</Label>
          <DatePicker value={tanggal} onChange={setTanggal} />
        </div>
      </div>

      {/* Keterangan */}
      <div className="col-span-12 flex flex-col gap-2">
        <Label htmlFor="keterangan">Keterangan</Label>
        <div className="flex items-center">
          <Textarea
            placeholder="Masukkan keterangan..."
            name="keterangan"
            id="keterangan"
          />
        </div>
      </div>

      {/* Item dari PR */}
      <div className="col-span-12">
        <Table>
          <TableHeader>
            <TableRow className="border [&>*]:border">
              <TableHead className="w-[50px] font-semibold text-center">
                No
              </TableHead>
              <TableHead className="font-semibold text-center">
                Part Number
              </TableHead>
              <TableHead className="font-semibold text-center">
                Part Name
              </TableHead>
              <TableHead className="font-semibold text-center">
                Satuan
              </TableHead>
              <TableHead className="font-semibold text-center">Qty</TableHead>
              <TableHead className="font-semibold text-center">
                Untuk MR
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedPR && selectedPR.details.length > 0 ? (
              selectedPR.details.map((item, index) => (
                <TableRow key={index} className="border [&>*]:border">
                  <TableCell className="w-[50px]">{index + 1}</TableCell>
                  <TableCell className="text-start">
                    {item.dtl_pr_part_number}
                  </TableCell>
                  <TableCell className="text-start">{item.dtl_pr_part_name}</TableCell>
                  <TableCell>{item.dtl_pr_satuan}</TableCell>
                  <TableCell>{item.dtl_pr_qty}</TableCell>
                  <TableCell>{item.mr.mr_kode}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada item PR.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </form>
  );
}
