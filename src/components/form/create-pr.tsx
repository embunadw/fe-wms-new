// import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
// import { toast } from "sonner";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { getAllMr } from "@/services/material-request";
// import type { MasterPart, MR, PR, PRItem, UserComplete, UserDb } from "@/types";
// import { DatePicker } from "../date-picker";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Button } from "../ui/button";
// import { LokasiList } from "@/types/enum";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "../ui/command";
// import { cn } from "@/lib/utils";
// import { getMasterParts } from "@/services/master-part";
// import { AddItemPRDialog } from "../dialog/add-item-pr";
// import { createPR } from "@/services/purchase-request";
// import { Timestamp } from "firebase/firestore";

// interface CreatePRFormProps {
//   user: UserComplete | UserDb;
//   setRefresh: Dispatch<SetStateAction<boolean>>;
// }

// export default function CreatePRForm({ user, setRefresh }: CreatePRFormProps) {
//   const [tanggalPR, setTanggalPR] = useState<Date | undefined>(new Date());
//   const [prItems, setPRItems] = useState<PRItem[]>([]);
//   const [mrIncluded, setMrIncluded] = useState<string[]>([]);

//   // Pencarian master part
//   const [open, setOpen] = useState<boolean>(false);
//   const [open2, setOpen2] = useState<boolean>(false);
//   const [masterParts, setMasterParts] = useState<MasterPart[]>([]);
//   const [filteredParts, setFilteredParts] = useState<MasterPart[]>([]);
//   const [mr, setMR] = useState<MR[]>([]);
//   const [filteredMr, setFilteredMR] = useState<MR[]>([]);
//   const [selectedPart, setSelectedPart] = useState<MasterPart>();
//   const [selectedMr, setSelectedMr] = useState<MR>();

//   // Fetch master parts
//   useEffect(() => {
//     async function fetchMasterParts() {
//       try {
//         const parts = await getMasterParts();
//         setMasterParts(parts);
//         setFilteredParts(parts);
//       } catch (error) {
//         if (error instanceof Error) {
//           toast.error(`Gagal mengambil data master part: ${error.message}`);
//         } else {
//           toast.error("Terjadi kesalahan saat mengambil data master part.");
//         }
//       }
//     }

//     fetchMasterParts();
//   }, []);

//   // Fetch Mr
//   useEffect(() => {
//     async function fetchMR() {
//       try {
//         const mr = await getAllMr();
//         setMR(mr);
//         setFilteredMR(mr);
//       } catch (error) {
//         if (error instanceof Error) {
//           toast.error(`Gagal mengambil data MR: ${error.message}`);
//         } else {
//           toast.error("Terjadi kesalahan saat mengambil data MR.");
//         }
//       }
//     }

//     fetchMR();
//   }, []);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     if (prItems.length === 0) {
//       toast.error("Belum ada item untuk PR ini.");
//       return;
//     }

//     const formData = new FormData(event.currentTarget);
//     const kodePR = formData.get("kodePR") as string;

//     const data: PR = {
//       kode: kodePR,
//       status: "open",
//       lokasi: user.lokasi,
//       pic: user.nama,
//       mrs: mrIncluded,
//       order_item: prItems.map((item) => ({
//         part_id: item.part_id,
//         part_number: item.part_number,
//         part_name: item.part_name,
//         satuan: item.satuan,
//         qty: item.qty,
//         kode_mr: item.kode_mr,
//       })),
//       created_at: Timestamp.now(),
//       updated_at: Timestamp.now(),
//     };

//     try {
//       const res = await createPR(data);
//       if (res) {
//         toast.success("Purchase Request berhasil dibuat.");
//         setMrIncluded([]);
//         setRefresh((prev) => !prev);
//         setPRItems([]);
//         setTanggalPR(new Date());
//       } else {
//         toast.error("Gagal membuat Purchase Request. Silakan coba lagi.");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(`Gagal membuat PR: ${error.message}`);
//       } else {
//         toast.error("Terjadi kesalahan saat membuat PR.");
//       }
//       return;
//     }
//   }

//   function handleAddItem(part: MasterPart, qty: number) {
//     if (!part || !qty || qty <= 0 || !selectedMr) {
//       toast.error(
//         "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
//       );
//       return;
//     }

//     const newItem: PRItem = {
//       part_name: part.part_name,
//       part_number: part.part_number,
//       satuan: part.part_satuan,
//       qty: qty,
//       kode_mr: selectedMr.kode,
//     };

//     setPRItems((prevItems) => [...prevItems, newItem]);
//     setMrIncluded((prev) => [...prev, selectedMr.kode]);
//     setSelectedPart(undefined);
//     setSelectedMr(undefined);
//     setOpen(false);
//     setOpen2(false);
//     toast.success("Item berhasil ditambahkan ke daftar.");
//   }

//   function handleRemoveItem(index: number) {
//     setPRItems((prevItems) => prevItems.filter((_, i) => i !== index));
//     toast.success("Item berhasil dihapus dari daftar.");
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       id="create-pr-form"
//       className="grid grid-cols-12 gap-4"
//     >
//       <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
//         {/* Kode PR */}
//         <div className="flex flex-col gap-2">
//           <Label htmlFor="kodePR">Kode PR</Label>
//           <Input name="kodePR" className="lg:tracking-wider" required />
//         </div>

//         {/* Tanggal PR */}
//         <div className="flex flex-col gap-2">
//           <Label>Tanggal PR</Label>
//           <div className="flex items-center">
//             <DatePicker value={tanggalPR} onChange={setTanggalPR} />
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
//         {/* PIC */}
//         <div className="flex flex-col gap-2">
//           <Label>Person in Charge</Label>
//           <div className="flex items-center">
//             <Input value={user.nama} name="pic" disabled />
//           </div>
//         </div>

//         {/* Lokasi */}
//         <div className="flex flex-col gap-2">
//           <Label htmlFor="lokasi">Lokasi</Label>
//           <div className="flex items-center">
//             <Select required name="lokasi" value={user.lokasi} disabled>
//               <SelectTrigger className="w-full" name="lokasi" id="lokasi">
//                 <SelectValue
//                   placeholder={user.lokasi}
//                   defaultValue={user.lokasi}
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Daftar Lokasi</SelectLabel>
//                   {LokasiList?.map((lokasi) => (
//                     <SelectItem key={lokasi.kode} value={lokasi.nama}>
//                       {lokasi.nama}
//                     </SelectItem>
//                   ))}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       {/* Tambah Item PR */}
//       <div className="col-span-12 grid grid-cols-12 gap-4">
//         {/* Combobox Item */}
//         <Popover open={open} onOpenChange={setOpen}>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               role="combobox"
//               aria-expanded={open}
//               className={cn("col-span-12 lg:col-span-4 justify-between")}
//             >
//               {selectedPart
//                 ? masterParts.find(
//                     (part: MasterPart) =>
//                       part.part_number === selectedPart.part_number
//                   )?.part_number
//                 : "Cari part number..."}
//               <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
//             <Command>
//               <CommandInput placeholder="Cari part number..." />
//               <CommandList>
//                 <CommandEmpty>Tidak ada.</CommandEmpty>
//                 <CommandGroup>
//                   {filteredParts?.map((part) => (
//                     <CommandItem
//                       key={part.part_number}
//                       value={part.part_number}
//                       onSelect={(currentValue) => {
//                         setSelectedPart(
//                           masterParts.find(
//                             (part) => part.part_number === currentValue
//                           )
//                         );
//                         setOpen(false);
//                       }}
//                     >
//                       <CheckIcon
//                         className={cn(
//                           "mr-2 h-4 w-4",
//                           selectedPart?.part_number === part.part_number
//                             ? "opacity-100"
//                             : "opacity-0"
//                         )}
//                       />
//                       {`${part.part_number} | ${part.part_name}`}
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               </CommandList>
//             </Command>
//           </PopoverContent>
//         </Popover>

//         {/* Combobox Referensi MR */}
//         <Popover open={open2} onOpenChange={setOpen2}>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               role="combobox"
//               aria-expanded={open2}
//               className={cn("col-span-12 lg:col-span-4 justify-between")}
//             >
//               {selectedMr
//                 ? mr.find((mr: MR) => mr.kode === selectedMr?.kode)?.kode
//                 : "Cari kode mr..."}
//               <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
//             <Command>
//               <CommandInput placeholder="Cari kode mr..." />
//               <CommandList>
//                 <CommandEmpty>Tidak ada.</CommandEmpty>
//                 <CommandGroup>
//                   {filteredMr?.map((m) => (
//                     <CommandItem
//                       key={m.kode}
//                       value={m.kode}
//                       onSelect={(currentValue) => {
//                         setSelectedMr(mr.find((m) => m.kode === currentValue));
//                         setOpen2(false);
//                       }}
//                     >
//                       <CheckIcon
//                         className={cn(
//                           "mr-2 h-4 w-4",
//                           selectedMr?.kode === m.kode
//                             ? "opacity-100"
//                             : "opacity-0"
//                         )}
//                       />
//                       {`${m.kode}`}
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               </CommandList>
//             </Command>
//           </PopoverContent>
//         </Popover>

//         <AddItemPRDialog
//           selectedPart={selectedPart}
//           onAddItem={handleAddItem}
//           triggerButton={
//             <Button
//               className="col-span-12 md:col-span-4"
//               variant={"outline"}
//               disabled={!selectedPart || !selectedMr}
//             >
//               Tambah Barang
//             </Button>
//           }
//         />
//       </div>

//       {/* Item yang masuk PR */}
//       <div className="col-span-12">
//         <Table>
//           <TableHeader>
//             <TableRow className="border [&>*]:border">
//               <TableHead className="w-[50px] font-semibold text-center">
//                 No
//               </TableHead>
//               <TableHead className="font-semibold text-center">
//                 Part Number
//               </TableHead>
//               <TableHead className="font-semibold text-center">
//                 Part Name
//               </TableHead>
//               <TableHead className="font-semibold text-center">
//                 Satuan
//               </TableHead>
//               <TableHead className="font-semibold text-center">Qty</TableHead>
//               <TableHead className="font-semibold text-center">
//                 Berdasarkan MR
//               </TableHead>
//               <TableHead className="font-semibold text-center">Aksi</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {prItems.length > 0 ? (
//               prItems?.map((item, index) => (
//                 <TableRow key={index} className="border [&>*]:border">
//                   <TableCell className="w-[50px]">{index + 1}</TableCell>
//                   <TableCell className="text-start">
//                     {item.part_number}
//                   </TableCell>
//                   <TableCell className="text-start">{item.part_name}</TableCell>
//                   <TableCell>{item.satuan}</TableCell>
//                   <TableCell>{item.qty}</TableCell>
//                   <TableCell>{item.kode_mr}</TableCell>
//                   <TableCell>
//                     <Button
//                       type="button"
//                       size={"sm"}
//                       variant={"outline"}
//                       onClick={() => handleRemoveItem(index)}
//                     >
//                       Hapus
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={5}
//                   className="text-center text-muted-foreground"
//                 >
//                   Tidak ada item MR.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </form>
//   );
// }
