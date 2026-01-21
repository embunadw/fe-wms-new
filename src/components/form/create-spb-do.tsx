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

import { createSpbDo, getAllSpb } from "@/services/spb";
import type { Spb } from "@/types";

interface CreateSpbDoFormProps {
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateSpbDoForm({ setRefresh }: CreateSpbDoFormProps) {
  const [open, setOpen] = useState(false);
  const [spbs, setSpbs] = useState<Spb[]>([]);
  const [selectedSpb, setSelectedSpb] = useState<Spb | undefined>();

  /* =========================
     FETCH SPB (SUDAH PO, BELUM DO)
  ========================= */
  useEffect(() => {
    async function fetchSpb() {
      try {
        const res = await getAllSpb();
        setSpbs(res);
      } catch {
        toast.error("Gagal mengambil data SPB");
      }
    }
    fetchSpb();
  }, []);

  /* =========================
     SUBMIT
  ========================= */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedSpb) {
      toast.warning("SPB harus dipilih");
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      await createSpbDo({
        spb_id: selectedSpb.spb_id,
        do_no: formData.get("do_no") as string,
        do_date: formData.get("do_date") as string,
      });

      toast.success("DO berhasil dibuat");
      setRefresh((prev) => !prev);
      setSelectedSpb(undefined);
    } catch (err: any) {
        console.error("Error creating  SPB:", err);
        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          "Gagal membuat Delivery Order"
        );
    }
  }

  return (
  <form
    onSubmit={handleSubmit}
    id="create-spb-do-form"
    className="grid grid-cols-12 gap-4"
  >
    {/* ================= ROW 1 ================= */}
    <div className="col-span-12 lg:col-span-4 space-y-2">
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

    <div className="col-span-12 lg:col-span-4 space-y-2">
      <Label>No DO<span className="text-red-500">*</span></Label>
      <Input name="do_no" required />
    </div>

    <div className="col-span-12 lg:col-span-4 space-y-2">
      <Label>Tanggal DO<span className="text-red-500">*</span></Label>
      <Input type="date" name="do_date" required />
    </div>
  </form>
);
}
