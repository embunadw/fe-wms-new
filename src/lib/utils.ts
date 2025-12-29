/* =========================
   GENERAL UTILS (NO FIREBASE)
========================= */

/**
 * Gabung className (pengganti cn dari shadcn)
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format tanggal ke format Indonesia
 * input: string | Date
 * output: 12 Jan 2025
 */
export function formatTanggal(
  date?: string | Date | null
): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format datetime (opsional, kalau dipakai)
 */
export function formatDateTime(
  date?: string | Date | null
): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
