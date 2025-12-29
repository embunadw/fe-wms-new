import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetFormProps extends React.ComponentProps<"form"> {
  loading?: boolean;
}

export function ForgetPasswordForm({
  loading,
  className,
  ...props
}: ResetFormProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold"> Atur Ulang Kata Sandi </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Masukkan email anda yang terdaftar.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Atur Ulang Kata Sandi"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Atau
          </span>
        </div>
      </div>
      <div className="text-center text-sm">
        Kembali ke halaman{" "}
        <a href="/login" className="underline underline-offset-4">
          Masuk
        </a>{" "}
        atau{" "}
        <a href="/register" className="underline underline-offset-4">
          Daftar
        </a>
      </div>
    </form>
  );
}
