import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import { EditUserDialog } from "@/components/dialog/edit-user";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllUsers, updateUserStatus } from "@/services/user";
import type { UserDb } from "@/types";
import { PagingSize } from "@/types/enum";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserManagement() {
  const [users, setUsers] = useState<UserDb[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDb[]>([]);
  const [tableUsers, setTableUsers] = useState<UserDb[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Filtering
  const [email, setEmail] = useState<string>("");
  const [nama, setNama] = useState<string>("");
  const [lokasi, setLokasi] = useState<string>("");
  const [role, setRole] = useState<string>("");

  // Soft delete
  async function handleDeactivate(userId: string) {
    try {
      await updateUserStatus(userId, "inactive");
      toast.success("User berhasil dinonaktifkan");
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Gagal menonaktifkan user");
    }
  }

  async function handleActivate(userId: string) {
    try {
      await updateUserStatus(userId, "active");
      toast.success("User berhasil diaktifkan kembali");
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Gagal mengaktifkan user");
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      const result = await getAllUsers();
      if (result) {
        setUsers(result);
        setFilteredUsers(result);
        setTableUsers(result.slice(0, PagingSize));
        resetFilter();
      } else {
        toast.error("Gagal memuat data pengguna");
      }
    }
    fetchUsers();
  }, [refresh]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setTableUsers(filteredUsers.slice(startIndex, endIndex));
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    let data = users.filter((u) => u.status !== "inactive"); // default hanya tampilkan aktif

    if (email) data = data.filter((u) => u.email.toLowerCase().includes(email.toLowerCase()));
    if (nama) data = data.filter((u) => u.nama.toLowerCase().includes(nama.toLowerCase()));
    if (lokasi) data = data.filter((u) => u.lokasi.toLowerCase().includes(lokasi.toLowerCase()));
    if (role) data = data.filter((u) => u.role.toLowerCase().includes(role.toLowerCase()));

    setFilteredUsers(data);
    setTableUsers(data.slice(0, PagingSize));
    setCurrentPage(1);
  }, [users, email, nama, lokasi, role]);

  function resetFilter() {
    setEmail("");
    setNama("");
    setLokasi("");
    setRole("");
  }

  return (
    <WithSidebar>
      <SectionContainer span={12}>
        <SectionHeader>Daftar Pengguna</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="flex flex-col gap-4 col-span-12 border border-border rounded-sm p-2 overflow-x-auto">
            {/* Filtering */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
              <div className="col-span-12 md:col-span-4 lg:col-span-5">
                <Input
                  placeholder="Cari berdasarkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Filter Tambahan
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nama</label>
                      <Input placeholder="nama" value={nama} onChange={(e) => setNama(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <Input placeholder="role" value={role} onChange={(e) => setRole(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Lokasi</label>
                      <Input placeholder="lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-12 md:col-span-4 lg:col-span-2">
                <Button className="w-full" variant={"destructive"} onClick={resetFilter}>
                  Hapus Filter
                </Button>
              </div>
            </div>

            <table className="min-w-full text-sm text-left border-collapse table-auto">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b">
                  <th className="p-2">No</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Lokasi</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableUsers?.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-accent">
                    <td className="p-2">{(currentPage - 1) * PagingSize + index + 1}</td>
                    <td className="p-2">{user.nama}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.lokasi}</td>
                    <td className="p-2">{user.status}</td>
                    <td className="p-2 flex gap-2 items-center">
                      <EditUserDialog user={user} refresh={setRefresh} />

                      {user.status === "active" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Nonaktifkan</Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Yakin ingin menonaktifkan user ini?</AlertDialogTitle>
                              <AlertDialogDescription>
                                User <b>{user.nama}</b> akan dinonaktifkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => handleDeactivate(user.id)}
                              >
                                Ya, Nonaktifkan
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => handleActivate(user.id)}>
                          Aktifkan Kembali
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBody>

        <SectionFooter>
          <MyPagination
            data={filteredUsers}
            currentPage={currentPage}
            triggerNext={() => setCurrentPage((prev) => prev + 1)}
            triggerPrevious={() => setCurrentPage((prev) => prev - 1)}
            triggerPageChange={(page: number) => setCurrentPage(page)}
          />
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
