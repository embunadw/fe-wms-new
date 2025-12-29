import api from "@/lib/axios"; 
import type { UserDb } from "@/types";

/**
 * Get all users
 */
export async function getAllUsers(): Promise<UserDb[]> {
  try {
    const res = await api.get("/users");
    return res.data.data as UserDb[];
  } catch (error: any) {
    console.error("Error fetching all users:", error);
    throw new Error(error.response?.data?.message || "Gagal mengambil data user.");
  }
}

/**
 * Update user
 */
export async function updateUser(user: Partial<UserDb>): Promise<boolean> {
  if (!user.id) throw new Error("User ID is required for update.");

  try {
    await api.put(`/users/${user.id}`, {
      nama: user.nama,
      role: user.role,
      lokasi: user.lokasi,
    });
    return true;
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(error.response?.data?.message || "Gagal memperbarui user.");
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await api.delete(`/users/${id}`);
    return true;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error(
      error.response?.data?.message || "Gagal menghapus user."
    );
  }
}

/**
 * Update user status (soft delete / re-activate)
 */
export async function updateUserStatus(userId: string, status: "active" | "inactive"): Promise<boolean> {
  try {
    await api.put(`/users/${userId}/status`, { status });
    return true;
  } catch (error: any) {
    console.error("Error updating user status:", error);
    throw new Error(error.response?.data?.message || "Gagal memperbarui status user.");
  }
}
