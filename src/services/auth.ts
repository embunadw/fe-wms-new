import api from "@/lib/axios";
import { toast } from "sonner";
import type { UserComplete } from "@/types";

interface Register {
  email: string;
  nama: string;
  password: string;
   lokasi: string;
}

interface SignIn {
  email: string;
  password: string;
}

/**
 * Sign in dengan email & password
 */
export async function signIn(dto: SignIn): Promise<UserComplete> {
  try {
    const res = await api.post("/auth/login", {
      email: dto.email.trim(),
      password: dto.password,
    });

    const user: UserComplete = res.data.user;
    localStorage.setItem("token", res.data.token);

    return user;
  } catch (error: any) {
    console.log("LOGIN ERROR:", error.response?.data);
    if (error.response?.status === 401) {
      throw new Error("Email atau password salah.");
    }
    throw new Error(error.response?.data?.message || "Gagal login.");
  }
}

/**
 * Register user baru
 */
export async function registerUser(dto: Register): Promise<boolean> {
  try {
    const res = await api.post("/auth/register", dto);
    toast.info(res.data.message || "Pendaftaran berhasil. Silakan login.");
    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Gagal melakukan pendaftaran.");
  }
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser(): Promise<UserComplete | null> {
  try {
    const res = await api.get("/auth/me");
    return res.data.user;
  } catch (error: any) {
    return null; // user tidak login
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<boolean> {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    throw new Error("Logout gagal.");
  }
}