import { type Dispatch, type SetStateAction } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { MasterPart } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { createMasterPart } from "@/services/master-part";

interface CreateMRFormProps {
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const Satuan = [
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
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const partNumber = formData.get("part_number") as string;
    const partName = formData.get("part_name") as string;
    const satuan = formData.get("part_satuan") as string;
    if (!partNumber || !partName || !satuan) {
      toast.warning("Semua field harus diisi!");
      return;
    }

    try {
      const data = {
        part_name: partName,
        part_number: partNumber,
        part_satuan: satuan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } satisfies MasterPart;
      const res = await createMasterPart(data);
      if (res) {
        toast.success("Master part berhasil dibuat!");
        setRefresh((prev) => !prev);
      } else {
        toast.error("Part number sudah ada, silakan gunakan part number lain.");
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(`Gagal membuat master part: ${error.message}`);
      } else {
        toast.error(
          "Gagal membuat master part: Terjadi kesalahan yang tidak diketahui."
        );
      }
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      id="create-master-part-form"
      className="grid grid-cols-12 gap-4"
    >
      <div className="flex flex-col col-span-12 lg:col-span-3 gap-4">
        {/* Part number */}
        <div className="flex flex-col gap-2">
          <Label>Part Number</Label>
          <div className="flex items-center">
            <Input
              name="part_number"
              placeholder="Input part number"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Part Name */}
        <div className="flex flex-col gap-2">
          <Label>Part Name</Label>
          <div className="flex items-center">
            <Input name="part_name" placeholder="Input part name" required />
          </div>
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-3 gap-4">
        {/* Part Name */}
        <div className="flex flex-col gap-2">
          <Label>Satuan</Label>
          <div className="flex items-center">
            <Select name="part_satuan" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih satuan" />
              </SelectTrigger>
              <SelectContent>
                {Satuan.map((satuan) => (
                  <SelectItem key={satuan} value={satuan}>
                    {satuan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </form>
  );
}
