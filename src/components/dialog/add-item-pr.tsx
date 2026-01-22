// components/dialog/AddItemPRDialog.tsx
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
} from "@/components/ui/select";

interface AddItemPRDialogProps {
  parts: MasterPart[];                 // ⬅️ LIST PART
  onAddItem: (part: MasterPart, qty: number) => void;
  triggerButton: React.ReactNode;
}

export function AddItemPRDialog({
  parts,
  onAddItem,
  triggerButton,
}: AddItemPRDialogProps) {
  const [selectedPartId, setSelectedPartId] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);

  const selectedPart = parts.find(
    (p) => p.part_id?.toString() === selectedPartId
  );

  const handleSaveItem = () => {
    if (!selectedPart || qty <= 0) {
      toast.error("Part dan jumlah wajib diisi");
      return;
    }

    onAddItem(selectedPart, qty);

    setQty(1);
    setSelectedPartId("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Purchase Request</DialogTitle>
          <DialogDescription>
            Pilih part dan isi jumlah purchase request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* PART DROPDOWN */}
          <div className="flex flex-col gap-2">
            <Label>Part<span className="text-red-500">*</span></Label>
            <Select
              value={selectedPartId}
              onValueChange={setSelectedPartId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Part" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {parts.map((part) => (
                    <SelectItem
                      key={part.part_id}
                      value={part.part_id!.toString()}
                    >
                      {part.part_number} - {part.part_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* SATUAN */}
          <div className="flex flex-col gap-2">
            <Label>Satuan</Label>
            <Input value={selectedPart?.part_satuan ?? ""} disabled />
          </div>

          {/* JUMLAH */}
          <div className="flex flex-col gap-2">
            <Label>Jumlah<span className="text-red-500">*</span></Label>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSaveItem}
            className="!bg-green-600 hover:!bg-green-700 text-white"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}