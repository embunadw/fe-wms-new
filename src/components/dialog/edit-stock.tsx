import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Stock } from "@/types";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import { saveStock } from "@/services/stock";

interface MyDialogProps {
  onSubmit?: () => void;
  stock: Stock;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditStockDialog({ stock, refresh }: MyDialogProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const min = formData.get("stk_min") as string;
    const max = formData.get("stk_max") as string;
    const qty = formData.get("stk_qty") as string;
    if (!stock.stk_id) {
      toast.error("Stock tidak ditemukan");
      return;
    }

    // if (min === stock.min && max === stock.max && qty === stock.qty) {
    //   toast.warning("Tidak ada perubahan yang dilakukan");
    //   return;
    // }

    try {
      const res = await saveStock({
        part_id: Number(stock.part_id),
        stk_location: stock.stk_location,
        stk_qty: parseInt(qty, 10),
        stk_min: parseInt(min, 10),
        stk_max: parseInt(max, 10),
      });
      if (res) {
        toast.success("Data stock berhasil diupdate");
        refresh((prev) => !prev);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal mengupdate stock: ${error.message}`);
      } else {
        toast.error("Gagal mengupdate stock");
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Edit Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Stock</DialogTitle>
          <DialogDescription>
            Ubah informasi stock yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="edit-stock-form">
          <div className="grid gap-4">
            {/* Part Number */}
            <div className="grid gap-3">
              <Label htmlFor="part_number">Part Number</Label>
              <Input
                id="part_number"
                name="part_number"
                defaultValue={stock.part_number}
                disabled
              />
            </div>
            {/* Part Nama */}
            <div className="grid gap-3">
              <Label htmlFor="part_name">Part Name</Label>
              <Input
                id="part_name"
                name="part_name"
                defaultValue={stock.part_name}
                disabled
              />
            </div>
            {/* lokasi */}
            <div className="grid gap-3">
              <Label htmlFor="stk_location">Lokasi gudang</Label>
              <Input
                id="stk_location"
                name="stk_location"
                defaultValue={stock.stk_location}
                disabled
              />
            </div>
            {/* min */}
            <div className="grid gap-3">
              <Label htmlFor="stk_min">Min Stock</Label>
              <Input id="stk_min" name="stk_min" defaultValue={stock.stk_min} />
            </div>
            {/* max */}
            <div className="grid gap-3">
              <Label htmlFor="stk_max">Max Stock</Label>
              <Input id="stk_max" name="stk_max" defaultValue={stock.stk_max} />
            </div>
            {/* Stock */}
            <div className="grid gap-3">
              <Label htmlFor="stk_qty">Qty Stock</Label>
              <Input id="stk_qty" name="stk_qty" defaultValue={stock.stk_qty} />
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batalkan</Button>
          </DialogClose>
          <Button type="submit" form="edit-stock-form">
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
