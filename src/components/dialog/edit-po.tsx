// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "../ui/label";
// import { Button } from "../ui/button";
// import type { PO, POHeader } from "@/types";
// import { toast } from "sonner";
// import type { Dispatch, SetStateAction } from "react";
// import { updatePO } from "@/services/purchase-order";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Textarea } from "../ui/textarea";

// interface MyDialogProps {
//   po: PO;
//   refresh: Dispatch<SetStateAction<boolean>>;
// }

// export function EditPODialog({ po, refresh }: MyDialogProps) {
//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     if (!po) {
//       toast.error("Stock tidak ditemukan");
//       return;
//     }

//     const status = formData.get("status") as string;
//     const keterangan = formData.get("keterangan") as string;

//     const data: POHeader = {
//       kode: po.po_kode,
//       kode_pr: po.pu,
//       tanggal_estimasi: po.tanggal_estimasi,
//       status,
//       keterangan,
//       pic: po.pic,
//       created_at: Timestamp.now(),
//       updated_at: Timestamp.now(),
//     };

//     try {
//       const res = await updatePO(data);
//       if (res) {
//         toast.success("Data PO berhasil diupdate");
//         refresh((prev) => !prev);
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(`Gagal mengupdate PO: ${error.message}`);
//       } else {
//         toast.error("Gagal mengupdate PO");
//       }
//     }
//   }
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size={"sm"}>
//           Edit PO
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit PO</DialogTitle>
//           <DialogDescription>Ubah informasi PO yang dipilih.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} id="edit-po-form">
//           <div className="grid gap-4">
//             {/* Status */}
//             <div className="grid gap-3">
//               <Label htmlFor="kode">Status PO</Label>
//               <Select required name="status" defaultValue={po.status}>
//                 <SelectTrigger className="w-full" name="status" id="status">
//                   <SelectValue placeholder="Pilih status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Daftar Status</SelectLabel>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="purchased">Purchased</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//             {/* Keterangan */}
//             <div className="grid gap-3">
//               <Label htmlFor="keterangan">Keterangan</Label>
//               <Textarea
//                 id="keterangan"
//                 name="keterangan"
//                 placeholder="Masukkan keterangan..."
//                 defaultValue={po.keterangan || ""}
//               />
//             </div>
//           </div>
//         </form>
//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="outline">Batalkan</Button>
//           </DialogClose>
//           <Button type="submit" form="edit-po-form">
//             Edit
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
