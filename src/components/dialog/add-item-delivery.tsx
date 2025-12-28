// components/dialog/AddItemDeliveryDialog.tsx
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

// ⬇️ ubah tipe dari MRItem ke MRDetail
import type { MRDetail } from "@/types";

interface AddDeliveryItemDialogProps {
  mr_item: MRDetail | undefined;
  dari: string;

  // ⬇️ callback mengikuti MRDetail
  onAddItem: (part: MRDetail, qty: number) => void;

  triggerButton: React.ReactNode;
}

export function AddItemDeliveryDialog({
  mr_item,
  onAddItem,
  dari,
  triggerButton,
}: AddDeliveryItemDialogProps) {

  const [qty, setQty] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveItem = () => {
    if (!mr_item || qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    onAddItem(mr_item, qty);

    setQty(1);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Delivery</DialogTitle>
          <DialogDescription>
            Masukkan detail untuk item yang akan dikirim.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          {/* PART NUMBER */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="partNo">Part No</Label>
            <Input
              id="partNo"
              value={mr_item?.dtl_mr_part_number}
              disabled
              required
            />
          </div>

          {/* PART NAME */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="partName">Nama Part</Label>
            <Input
              id="partName"
              value={mr_item?.dtl_mr_part_name}
              disabled
              required
            />
          </div>

          {/* SATUAN */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              value={mr_item?.dtl_mr_satuan}
              disabled
              required
            />
          </div>

          {/* QTY REQUEST */}
          <div className="flex flex-col gap-2">
            <Label>Jumlah yg diminta</Label>
            <Input
              type="number"
              value={mr_item?.dtl_mr_qty_request}
              disabled
              required
            />
          </div>

          {/* LOCATION */}
          <div className="flex flex-col gap-2">
            <Label>Gudang dipilih untuk mengirim</Label>
            <Input value={dari} disabled required />
          </div>

          {/* QTY DELIVERY */}
          <div className="flex flex-col gap-2">
            <Label>Jumlah yg akan dikirim</Label>
            <Input
              id="qty_delivery"
              type="number"
              placeholder="Jumlah yang akan dikirim"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              min="1"
              required
            />
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
