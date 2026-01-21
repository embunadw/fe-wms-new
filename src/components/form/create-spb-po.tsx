import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { createSpbPo } from "@/services/spb";
import { getAllSpb } from "@/services/spb";
import type { Spb } from "@/types";

interface CreateSpbPoFormProps {
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateSpbPoForm({ setRefresh }: CreateSpbPoFormProps) {
  const [open, setOpen] = useState(false);
  const [spbs, setSpbs] = useState<Spb[]>([]);
  const [selectedSpb, setSelectedSpb] = useState<Spb>();

  /* =========================
     FETCH SPB (BELUM PO)
  ========================= */
  useEffect(() => {
    async function fetchSpb() {
      try {
        const res = await getAllSpb(); // WHERE po_no IS NULL
        setSpbs(res);
      } catch {
        toast.error("Gagal mengambil data SPB");
      }
    }
    fetchSpb();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedSpb) {
      toast.warning("SPB harus dipilih");
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      await createSpbPo({
        spb_id: selectedSpb.spb_id,
        po_no: formData.get("po_no") as string,
        so_no: formData.get("so_no") as string,
        so_date: formData.get("so_date") as string,
      });

      toast.success("PO berhasil di-attach ke SPB");
      setRefresh((prev) => !prev);
      setSelectedSpb(undefined);
      } catch (err: any) {
        console.error("Error creating PO SPB:", err);
        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          "Gagal membuat Purchase Order"
        );
    }
  }

  return (
  <form
    onSubmit={handleSubmit}
    id="create-spb-po-form"
    className="grid grid-cols-12 gap-4"
  >
    {/* ================= ROW 1 ================= */}
    <div className="col-span-12 lg:col-span-6 space-y-2">
      <Label>Pilih SPB<span className="text-red-500">*</span></Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedSpb ? selectedSpb.spb_no : "Pilih SPB..."}
            <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Cari SPB..." />
            <CommandList>
              <CommandEmpty>Tidak ada SPB.</CommandEmpty>
              <CommandGroup>
                {spbs.map((spb) => (
                  <CommandItem
                    key={spb.spb_id}
                    value={spb.spb_no}
                    onSelect={() => {
                      setSelectedSpb(spb);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSpb?.spb_id === spb.spb_id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {spb.spb_no}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <div className="col-span-12 lg:col-span-6 space-y-2">
      <Label>No PO<span className="text-red-500">*</span></Label>
      <Input name="po_no" required />
    </div>

    {/* ================= ROW 2 ================= */}
    <div className="col-span-12 lg:col-span-6 space-y-2">
      <Label>No SO<span className="text-red-500">*</span></Label>
      <Input name="so_no" />
    </div>

    <div className="col-span-12 lg:col-span-6 space-y-2">
      <Label>Tanggal SO<span className="text-red-500">*</span></Label>
      <Input type="date" name="so_date" />
    </div>
  </form>
);
}
