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
import { Button } from "../ui/button";
import type { POReceive, UpdatePOPayload } from "@/types";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import { updatePO } from "@/services/purchase-order";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface MyDialogProps {
  po: POReceive; 
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditPODialog({ po, refresh }: MyDialogProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload: UpdatePOPayload = {
      po_status: formData.get("status") as "pending" | "purchased",
      po_keterangan: formData.get("keterangan") as string,
    };

    try {
      await updatePO(po.po_id, payload);
      toast.success("Data PO berhasil diupdate");
      refresh((prev) => !prev);
    } catch (error) {
      toast.error("Gagal mengupdate PO");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Edit PO
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit PO</DialogTitle>
          <DialogDescription>
            Ubah informasi PO yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="edit-po-form">
          <div className="grid gap-4">
            {/* Status */}
            <div className="grid gap-3">
              <Label>Status PO</Label>
              <Select name="status" defaultValue={po.po_status} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Daftar Status</SelectLabel>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="purchased">Purchased</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Keterangan */}
            <div className="grid gap-3">
              <Label>Keterangan</Label>
              <Textarea
                name="keterangan"
                placeholder="Masukkan keterangan..."
                defaultValue={po.po_keterangan || ""}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batalkan</Button>
          </DialogClose>
          <Button type="submit" form="edit-po-form">
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
