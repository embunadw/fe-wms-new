"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signIn } from "@/services/auth"; // auth.ts
import { toast } from "sonner";

interface LoginFormProps extends React.ComponentProps<"form"> {
  loading?: boolean;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await signIn({ email, password });
      toast.success(`Selamat datang, ${user.nama}!`);
      console.log("Login sukses:", user);
      // redirect ke dashboard misal
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Masuk ke akun anda</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Masukkan email dan kata sandi anda untuk login.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-1">
          <Label htmlFor="email">
            Email<span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="password">
              Kata Sandi<span className="text-red-500">*</span>
            </Label>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline text-red-500"
            >
              Lupa kata sandi?
            </a>
          </div>
          <Input
            id="password"
            disabled={loading}
            type="password"
            name="password"
            placeholder="masukkan password anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Masuk"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Belum memiliki akun?{" "}
        <a href="/register" className="underline underline-offset-4">
          Daftar
        </a>
      </div>
    </form>
  );
}