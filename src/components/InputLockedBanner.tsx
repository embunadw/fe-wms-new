import { useInputLock } from "@/context/InputLockContext";

export default function InputLockedBanner() {
  const { isOpen, message, loading } = useInputLock();

  // masih loading atau input masih dibuka → jangan tampilkan apa-apa
  if (loading || isOpen) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "12px 16px",
        textAlign: "center",
        fontWeight: 600,
        position: "sticky",
        top: 0,
        zIndex: 9999,
        borderBottom: "1px solid #fecaca",
      }}
    >
      {message || "Input ditutup setelah tanggal 5"}
    </div>
  );
}
