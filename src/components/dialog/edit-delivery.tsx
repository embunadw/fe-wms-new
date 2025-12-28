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
import type { DeliveryReceive } from "@/types";
import { toast } from "sonner";
import { type Dispatch, type SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { update } from "@/services/delivery";
import { DeliveryEkspedisi } from "@/types/enum";

interface MyDialogProps {
  delivery: DeliveryReceive;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditDeliveryDialog({ delivery, refresh }: MyDialogProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);


    if (!delivery.dlv_kode) {
      toast.error("Kode delivery tidak ditemukan");
      return;
    }

    const payload = {
      dlv_ekspedisi: formData.get("dlv_ekspedisi") as string,
      dlv_no_resi: formData.get("dlv_no_resi") as string,
      dlv_jumlah_koli: Number(formData.get("dlv_jumlah_koli")),

    };

    try {
      const res = await update(delivery.dlv_kode, payload);

      if (res) {
        toast.success("Delivery berhasil diupdate");
        refresh((prev) => !prev);
      }
    } catch (error) {
      toast.error("Gagal mengupdate delivery");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Edit Cepat
        </Button>
        
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Delivery</DialogTitle>
          <DialogDescription>
            Ubah informasi delivery yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="edit-delivery-form">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="kode">Kode IT</Label>
              <Input
                id="kode"
                name="kode"
                defaultValue={delivery.dlv_kode}
                disabled
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="dlv_ekspedisi">Ekspedisi yang digunakan</Label>
              <Select
                name="dlv_ekspedisi"
                defaultValue={delivery.dlv_ekspedisi ?? ""}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={delivery.dlv_ekspedisi} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ekspedisi</SelectLabel>
                    {DeliveryEkspedisi.map((eks, index) => (
                      <SelectItem value={eks} key={index}>
                        {eks}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="dlv_no_resi">Nomor resi</Label>
              <Input
                id="dlv_no_resi"
                name="dlv_no_resi"
                defaultValue={delivery.dlv_no_resi ?? ""}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="dlv_jumlah_koli">Jumlah Koli</Label>
              <Input
                id="dlv_jumlah_koli"
                type="number"
                name="dlv_jumlah_koli"
                defaultValue={delivery.dlv_jumlah_koli ?? ""}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batalkan</Button>
          </DialogClose>

          <Button type="submit" form="edit-delivery-form">
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
