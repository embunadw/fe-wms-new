// components/dialog/AddItemMRDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { MasterPart } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddItemMRDialogProps {
  selectedPart: MasterPart | undefined;
  onAddItem: (part: MasterPart, qty: number, priority: string) => void; // Callback untuk menambahkan item ke daftar di parent
  triggerButton: React.ReactNode;
}

export function AddItemMRDialog({
  selectedPart,
  onAddItem,
  triggerButton,
}: AddItemMRDialogProps) {
  const [qty, setQty] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [priority, setPriority] = useState<string>("p1");

  const handleSaveItem = () => {
    if (!selectedPart || qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    onAddItem(selectedPart, qty, priority);

    // Reset form dan tutup dialog
    setQty(1);
    setPriority("p1");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Material Request</DialogTitle>
          <DialogDescription>
            Masukkan detail untuk item material request yang baru.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="partNo">Part No</Label>
            <Input
              id="partNo"
              placeholder="Part number"
              value={selectedPart?.part_number}
              disabled
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partName">Nama Part</Label>
            <Input
              id="partName"
              placeholder="Nama part"
              value={selectedPart?.part_name}
              disabled
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              placeholder="Satuan (contoh: Pcs, Kg)"
              value={selectedPart?.part_satuan}
              disabled
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qty">Jumlah</Label>
            <Input
              id="qty"
              type="number"
              placeholder="Jumlah"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              min="1"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qty">Prioritas</Label>
            <Select required defaultValue={priority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="p1">P1</SelectItem>
                  <SelectItem value="p2">P2</SelectItem>
                  <SelectItem value="p3">P3</SelectItem>
                  <SelectItem value="p4">P4</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveItem}>
            Tambahkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
