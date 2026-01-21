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
import { Pencil } from "lucide-react";

interface EditCustomerDialogProps {
  customer: MasterCustomer;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditCustomerDialog({
  customer,
  refresh,
}: EditCustomerDialogProps) {
  const [open, setOpen] = useState(false);

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

      toast.success("Data customer berhasil diedit!");
      refresh((prev) => !prev);
      setOpen(false); 
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
        <Button variant="edit" size="sm">
  <Pencil className="h-4 w-4" />
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

           
            <div className="grid gap-3">
              <Label>No Customer<span className="text-red-500">*</span></Label>
              <Input value={customer.customer_no} disabled />

          
              <input
                type="hidden"
                name="customer_no"
                value={customer.customer_no}
              />
            </div>

           
            <div className="grid gap-3">
              <Label>Nama Customer<span className="text-red-500">*</span></Label>
              <Input
                name="customer_name"
                defaultValue={customer.customer_name}
                required
              />
            </div>

        
            <div className="grid gap-3">
              <Label>Telepon<span className="text-red-500">*</span></Label>
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

            <div className="grid gap-3">
              <Label>Nama Kontak<span className="text-red-500">*</span></Label>
              <Input
                name="contact_name"
                defaultValue={customer.contact_name}
              />
            </div>

          </div>
        </form>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-slate-300"
          >
            Batal
          </Button>

          <Button 
            type="submit" 
            form="edit-customer-form"
            className="!bg-orange-600 hover:!bg-orange-700 text-white"
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}