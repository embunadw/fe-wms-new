// src/components/form/create-pr.tsx
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { MRReceive, MasterPart, PRItem, UserComplete } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CheckIcon, ChevronsUpDownIcon, Trash2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import axios from "@/lib/axios";

interface CreatePRFormProps {
  setRefresh: Dispatch<SetStateAction<boolean>>;
  user: UserComplete;
}

export default function CreatePRForm({ setRefresh, user }: CreatePRFormProps) {
  const [kodePR, setKodePR] = useState<string>("");
  const [pic, setPic] = useState<string>(user.nama || "");
  const [lokasi, setLokasi] = useState<string>(user.lokasi || "");
  const [items, setItems] = useState<PRItem[]>([]);

  // State untuk MR dan Part
  const [mrs, setMrs] = useState<MRReceive[]>([]);
  const [parts, setParts] = useState<MasterPart[]>([]);
  const [selectedMr, setSelectedMr] = useState<MRReceive | null>(null);
  const [selectedPart, setSelectedPart] = useState<MasterPart | null>(null);
  const [qty, setQty] = useState<number>(1);

  // State untuk Popover/Combobox
  const [openMr, setOpenMr] = useState<boolean>(false);
  const [openPart, setOpenPart] = useState<boolean>(false);

  // Fetch MR yang open
  useEffect(() => {
    async function fetchMRs() {
      try {
        const res = await axios.get("/mr/open");
        setMrs(res.data.data || []);
      } catch (error) {
        console.error("Error fetching MRs:", error);
        toast.error("Gagal memuat daftar MR");
      }
    }
    fetchMRs();
  }, []);

  // Fetch Master Parts
  useEffect(() => {
    async function fetchParts() {
      try {
        const res = await axios.get("/master-part");
        setParts(res.data.data || []);
      } catch (error) {
        console.error("Error fetching parts:", error);
        toast.error("Gagal memuat daftar part");
      }
    }
    fetchParts();
  }, []);

  // Add Item
  function handleAddItem() {
    if (!selectedMr || !selectedPart || qty <= 0) {
      toast.error("Pilih MR, Part, dan masukkan quantity yang valid");
      return;
    }

    // Check if item already exists
    if (items.some((item) => item.part_number === selectedPart.part_number)) {
      toast.warning("Part ini sudah ada di daftar");
      return;
    }

    const newItem: PRItem = {
      part_id: Number(selectedPart.part_id),
      part_number: selectedPart.part_number,
      part_name: selectedPart.part_name,
      satuan: selectedPart.part_satuan,
      mr_id: Number(selectedMr.mr_id),
      kode_mr: selectedMr.mr_kode,
      qty,
    };

    setItems((prev) => [...prev, newItem]);
    
    // Reset selection
    setSelectedPart(null);
    setQty(1);
    
    toast.success("Item berhasil ditambahkan");
  }

  // Remove Item
  function handleRemoveItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    toast.success("Item berhasil dihapus");
  }

  // Submit PR
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!kodePR || !pic || !lokasi) {
      toast.error("Kode PR, PIC, dan Lokasi harus diisi");
      return;
    }

    if (items.length === 0) {
      toast.error("Tambahkan minimal 1 item");
      return;
    }

    try {
      await axios.post("/pr", {
        order_item: items,
        mrs: [...new Set(items.map((i) => i.kode_mr))],
        user_id: user.id,
      });

      toast.success("Purchase Request berhasil dibuat!");
      
      // Reset form
      setItems([]);
      setSelectedMr(null);
      setSelectedPart(null);
      setQty(1);
      setKodePR("");
      
      setRefresh(true);
      setTimeout(() => setRefresh(false), 100);
    } catch (error) {
      console.error("Error creating PR:", error);
      toast.error(
        `Gagal membuat PR: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  return (
    <form
      id="create-pr-form"
      onSubmit={handleSubmit}
      className="grid grid-cols-12 gap-4"
    >
      {/* Row 1: Kode PR, PIC, Lokasi */}
      <div className="flex flex-col col-span-12 lg:col-span-4 gap-4">
        {/* Kode PR */}
        <div className="flex flex-col gap-2">
          <Label>Kode PR</Label>
          <Input
            value={kodePR}
            onChange={(e) => setKodePR(e.target.value)}
            placeholder="Masukkan kode PR"
            required
          />
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-4 gap-4">
        {/* PIC */}
        <div className="flex flex-col gap-2">
          <Label>Person in Charge</Label>
          <Input
            value={pic}
            onChange={(e) => setPic(e.target.value)}
            disabled
          />
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-4 gap-4">
        {/* Lokasi */}
        <div className="flex flex-col gap-2">
          <Label>Lokasi</Label>
          <Input
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            disabled
          />
        </div>
      </div>

      {/* Row 2: Select MR, Select Part, Qty, Add Button */}
      <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
        <div className="col-span-12 lg:col-span-4">
          <Label>Pilih MR</Label>
          <Popover open={openMr} onOpenChange={setOpenMr}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openMr}
                className="w-full justify-between mt-2"
              >
                {selectedMr
                  ? `${selectedMr.mr_kode} - ${selectedMr.mr_pic}`
                  : "Pilih MR"}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Cari MR..." />
                <CommandList>
                  <CommandEmpty>Tidak ada MR tersedia.</CommandEmpty>
                  <CommandGroup>
                    {mrs.map((mr) => (
                      <CommandItem
                        key={mr.mr_id}
                        value={mr.mr_kode}
                        onSelect={() => {
                          setSelectedMr(mr);
                          setOpenMr(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMr?.mr_id === mr.mr_id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {`${mr.mr_kode} - ${mr.mr_pic} (${mr.mr_lokasi})`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Select Part */}
        <div className="col-span-12 lg:col-span-4">
          <Label>Pilih Part</Label>
          <Popover open={openPart} onOpenChange={setOpenPart}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPart}
                className="w-full justify-between mt-2"
                disabled={!selectedMr}
              >
                {selectedPart
                  ? `${selectedPart.part_number} - ${selectedPart.part_name}`
                  : "Pilih Part"}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Cari part number..." />
                <CommandList>
                  <CommandEmpty>Tidak ada part tersedia.</CommandEmpty>
                  <CommandGroup>
                    {parts.map((part) => (
                      <CommandItem
                        key={part.part_id}
                        value={part.part_number}
                        onSelect={() => {
                          setSelectedPart(part);
                          setOpenPart(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPart?.part_id === part.part_id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {`${part.part_number} | ${part.part_name}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Quantity */}
        <div className="col-span-12 md:col-span-6 lg:col-span-2">
          <Label htmlFor="qty">Qty</Label>
          <Input
            id="qty"
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="mt-2"
          />
        </div>

        {/* Add Button */}
        <div className="col-span-12 md:col-span-6 lg:col-span-2">
          <Button
            type="button"
            onClick={handleAddItem}
            className="w-full"
            disabled={!selectedMr || !selectedPart}
          >
            Tambah Item
          </Button>
        </div>
      </div>

      {/* Table Items */}
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
                Berdasarkan MR
              </TableHead>
              <TableHead className="font-semibold text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index} className="border [&>*]:border">
                  <TableCell className="w-[50px] text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-start">
                    {item.part_number}
                  </TableCell>
                  <TableCell className="text-start">{item.part_name}</TableCell>
                  <TableCell className="text-center">{item.satuan}</TableCell>
                  <TableCell className="text-center">{item.qty}</TableCell>
                  <TableCell className="text-center">{item.kode_mr}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  Tidak ada item PR.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="col-span-12 flex justify-between items-center p-4 bg-muted/50 rounded-sm border">
          <div className="text-sm text-muted-foreground">
            Total Item:{" "}
            <span className="font-semibold text-foreground">
              {items.length}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Quantity:{" "}
            <span className="font-semibold text-foreground">
              {items.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          </div>
        </div>
      )}
    </form>
  );
}