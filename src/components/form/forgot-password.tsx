import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/forgot-password", { email });
      toast.success(
        "Jika email terdaftar, instruksi atur ulang kata sandi akan dikirim"
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Gagal mengirim email atur ulang kata sandi"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button className="w-full" disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Email Reset"}
      </Button>
    </form>
  );
}
