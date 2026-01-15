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

import type { MasterCustomer } from "@/types";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { updateMasterCustomer } from "@/services/customer";
import axios from "axios";

interface EditCustomerDialogProps {
  customer: MasterCustomer;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditCustomerDialog({
  customer,
  refresh,
}: EditCustomerDialogProps) {
  const [open, setOpen] = useState(false);

  // ✅ STATE TELEPON (WAJIB)
  const [telephone, setTelephone] = useState<string>(
    customer.telephone ?? ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customer.customer_id) {
      toast.error("Customer ID tidak ditemukan");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const payload = {
      customer_no: formData.get("customer_no") as string,
      customer_name: formData.get("customer_name") as string,
      telephone: telephone,
      contact_name: formData.get("contact_name") as string,
    };

    // ✅ VALIDASI TELEPON
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
      await updateMasterCustomer(customer.customer_id, payload);

      toast.success("Data customer berhasil diupdate");
      refresh((prev) => !prev);
      setOpen(false); // ✅ AUTO CLOSE
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response.data.errors;

        if (errors?.customer_name) toast.error(errors.customer_name[0]);
        if (errors?.customer_no) toast.error(errors.customer_no[0]);
        if (errors?.telephone) toast.error(errors.telephone[0]);

        return;
      }

      toast.error("Terjadi kesalahan saat update data customer");
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
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Ubah informasi data master customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="edit-customer-form">
          <div className="grid gap-4">

            {/* No Customer (IMMUTABLE) */}
            <div className="grid gap-3">
              <Label>No Customer</Label>
              <Input value={customer.customer_no} disabled />

              {/* hidden input supaya terkirim */}
              <input
                type="hidden"
                name="customer_no"
                value={customer.customer_no}
              />
            </div>

            {/* Nama Customer */}
            <div className="grid gap-3">
              <Label>Nama Customer</Label>
              <Input
                name="customer_name"
                defaultValue={customer.customer_name}
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
                defaultValue={customer.contact_name}
              />
            </div>

          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>

          <Button type="submit" form="edit-customer-form">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
