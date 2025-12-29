import { type Dispatch, type SetStateAction } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { createMasterPart } from "@/services/master-part";
import type { CreateMasterPartPayload } from "@/types";

interface CreateMRFormProps {
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const SATUAN = [
  "PCS",
  "EACH",
  "UNIT",
  "BOX",
  "METER",
  "LUSIN",
  "LITER",
  "PACK",
  "SET",
  "PASANG",
  "ROL",
  "RIM",
  "LEMBAR",
  "CM",
  "JRG",
  "KG",
  "MONTH",
  "YEAR",
].sort();

export default function CreateMasterPartForm({
  setRefresh,
}: CreateMRFormProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload: CreateMasterPartPayload = {
      part_number: formData.get("part_number") as string,
      part_name: formData.get("part_name") as string,
      part_satuan: formData.get("part_satuan") as string,
    };

    if (!payload.part_number || !payload.part_name || !payload.part_satuan) {
      toast.warning("Semua field harus diisi!");
      return;
    }

    try {
      await createMasterPart(payload);
      toast.success("Master part berhasil dibuat!");
      setRefresh((prev) => !prev);
      e.currentTarget.reset();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Gagal membuat master part"
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="create-master-part-form"
      className="grid grid-cols-12 gap-4"
    >
      <div className="col-span-12 lg:col-span-3">
        <Label>Part Number</Label>
        <Input name="part_number" required />
      </div>

      <div className="col-span-12 lg:col-span-6">
        <Label>Part Name</Label>
        <Input name="part_name" required />
      </div>

      <div className="col-span-12 lg:col-span-3">
        <Label>Satuan</Label>
        <Select name="part_satuan" required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih satuan" />
          </SelectTrigger>
          <SelectContent>
            {SATUAN.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
