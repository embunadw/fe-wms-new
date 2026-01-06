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
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
// import { toast } from "sonner";
// import type { Dispatch, SetStateAction } from "react";
// import { updatePR } from "@/services/purchase-request";

// interface EditPRDialogProps {
//   pr: {
//     pr_id: number;
//     pr_kode: string;
//     pr_status: "open" | "close";
//     pr_priority: "normal" | "urgent";
//   };
//   refresh: Dispatch<SetStateAction<boolean>>;
// }

// export function EditPRDialog({ pr, refresh }: EditPRDialogProps) {
//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (!pr?.pr_id) {
//       toast.error("PR tidak ditemukan");
//       return;
//     }

//     const formData = new FormData(event.currentTarget);

//     const pr_status = formData.get("status") as "open" | "close";
//     const pr_priority = formData.get("priority") as "normal" | "urgent";

//     // ⛔ tidak ada perubahan
//     if (
//       pr_status === pr.pr_status &&
//       pr_priority === pr.pr_priority
//     ) {
//       toast.warning("Tidak ada perubahan data");
//       return;
//     }

//     try {
//       await updatePR(pr.pr_id, {
//         pr_status,
//         pr_priority,
//       });

//       toast.success("Data PR berhasil diperbarui");
//       refresh((prev) => !prev);
//     } catch (error) {
//       toast.error("Gagal memperbarui PR");
//     }
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           Edit Cepat
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit Purchase Request</DialogTitle>
//           <DialogDescription>
//             Ubah status atau prioritas PR
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} id="edit-pr-form">
//           <div className="grid gap-4">
//             {/* Kode PR */}
//             <div className="grid gap-2">
//               <Label>Kode PR</Label>
//               <p className="font-medium">{pr.pr_kode}</p>
//             </div>

//             {/* Prioritas */}
//             <div className="grid gap-2">
//               <Label>Prioritas</Label>
//               <Select
//                 name="priority"
//                 defaultValue={pr.pr_priority}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Pilih prioritas" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Prioritas</SelectLabel>
//                     <SelectItem value="normal">Normal</SelectItem>
//                     <SelectItem value="urgent">Urgent</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Status */}
//             <div className="grid gap-2">
//               <Label>Status</Label>
//               <Select
//                 name="status"
//                 defaultValue={pr.pr_status}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Pilih status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Status</SelectLabel>
//                     <SelectItem value="open">Open</SelectItem>
//                     <SelectItem value="close">Close</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </form>

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="outline">Batal</Button>
//           </DialogClose>
//           <Button type="submit" form="edit-pr-form">
//             Simpan
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
