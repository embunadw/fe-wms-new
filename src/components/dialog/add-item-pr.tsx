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
interface AddItemPRDialogProps {
  selectedPart: MasterPart | undefined;
  onAddItem: (part: MasterPart, qty: number) => void;
  triggerButton: React.ReactNode;
}

export function AddItemPRDialog({
  selectedPart,
  onAddItem,
  triggerButton,
}: AddItemPRDialogProps) {
  const [qty, setQty] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveItem = () => {
    if (!selectedPart || qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    onAddItem(selectedPart, qty);

    // Reset form dan tutup dialog
    setQty(1);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Purchase Request</DialogTitle>
          <DialogDescription>
            Masukkan detail untuk item purchase request yang baru.
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
            <Label htmlFor="qty">Jumlah<span className="text-red-500">*</span></Label>
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
        </div>
        <DialogFooter>
           <Button
              type="button"
              onClick={handleSaveItem}
              className="!bg-green-600 hover:!bg-green-700 text-white"
            >
              Tambah
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
