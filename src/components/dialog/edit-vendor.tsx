import {
  Dialog,
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

import type { MasterVendor } from "@/types";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { updateMasterVendor } from "@/services/vendor";
import axios from "axios";

interface EditVendorDialogProps {
  vendor: MasterVendor;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditVendorDialog({
  vendor,
  refresh,
}: EditVendorDialogProps) {
  const [open, setOpen] = useState(false);

  // ✅ STATE TELEPON (WAJIB)
  const [telephone, setTelephone] = useState<string>(
    vendor.telephone ?? ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!vendor.vendor_id) {
      toast.error("Vendor ID tidak ditemukan");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const payload = {
      vendor_no: formData.get("vendor_no") as string,
      vendor_name: formData.get("vendor_name") as string,
      telephone: telephone,
      contact_name: formData.get("contact_name") as string,
    };

    // ✅ VALIDASI FINAL (DOUBLE SAFETY)
    if (payload.telephone) {
      if (!/^[0-9]+$/.test(payload.telephone)) {
        toast.error("Nomor telepon hanya boleh angka");
        return;
      }

      if (payload.telephone.length > 13) {
        toast.error("Nomor telepon maksimal 13 digit");
        return;
      }
    }

    try {
      await updateMasterVendor(vendor.vendor_id, payload);

      toast.success("Data vendor berhasil diupdate");
      refresh((prev) => !prev);
      setOpen(false); // ✅ AUTO CLOSE
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;

        if (errors?.vendor_name) toast.error(errors.vendor_name[0]);
        if (errors?.vendor_no) toast.error(errors.vendor_no[0]);
        if (errors?.telephone) toast.error(errors.telephone[0]);

        return;
      }

      toast.error("Terjadi kesalahan saat update data vendor");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogDescription>
            Ubah informasi data master vendor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="edit-vendor-form">
          <div className="grid gap-4">

            {/* No Vendor (TIDAK BOLEH EDIT) */}
            <div className="grid gap-3">
              <Label>No Vendor</Label>
              <Input value={vendor.vendor_no} disabled />

              {/* hidden input supaya terkirim */}
              <input
                type="hidden"
                name="vendor_no"
                value={vendor.vendor_no}
              />
            </div>

            {/* Nama Vendor */}
            <div className="grid gap-3">
              <Label>Nama Vendor</Label>
              <Input
                name="vendor_name"
                defaultValue={vendor.vendor_name}
                required
              />
            </div>

            {/* Telepon (NUMERIC ONLY) */}
            <div className="grid gap-3">
              <Label>Telepon</Label>
              <Input
                name="telephone"
                value={telephone}
                onChange={(e) => {
                  const onlyNumber = e.target.value.replace(/\D/g, "");
                  setTelephone(onlyNumber.slice(0, 13));
                }}
                inputMode="numeric"
                placeholder="08xxxxxxxx"
              />
            </div>

            {/* Nama Kontak */}
            <div className="grid gap-3">
              <Label>Nama Kontak</Label>
              <Input
                name="contact_name"
                defaultValue={vendor.contact_name}
              />
            </div>

          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>

          <Button type="submit" form="edit-vendor-form">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
