import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Kata sandi tidak sama");
      return;
    }

    setLoading(true);

    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirm,
      });

      toast.success("Password berhasil direset");
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Gagal Atur Ulang Kata Sandi"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return <p>Token tidak valid</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        placeholder="Password baru"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Konfirmasi password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <Button className="w-full" disabled={loading}>
        {loading ? "Menyimpan..." : "Atur Ulang Kata Sandi"}
      </Button>
    </form>
  );
}
