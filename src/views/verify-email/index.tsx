// // src/app/verify-email/page.tsx (jika Anda menggunakan Next.js App Router)
// // src/pages/verify-email.tsx (jika Anda menggunakan Next.js Pages Router)
// // src/components/VerifyEmailPage.tsx (jika Anda ingin menggunakannya sebagai komponen terpisah)

// "use client"; // Tambahkan ini jika Anda menggunakan Next.js App Router dan ini adalah Client Component

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button"; // Asumsi Anda menggunakan Shadcn UI Button
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Asumsi Anda menggunakan Shadcn UI Alert
// import { Loader2 } from "lucide-react"; // Ikon loading, jika Anda menggunakan lucide-react
// import {
//   checkEmailVerificationStatus,
//   resendVerificationEmail,
// } from "@/services/auth";
// import { useNavigate } from "react-router-dom";

// export default function VerifyEmailPage() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Efek untuk mengecek status saat halaman dimuat (opsional, bisa dihilangkan jika hanya pakai tombol)
//   useEffect(() => {
//     const checkInitialStatus = async () => {
//       try {
//         const verified = await checkEmailVerificationStatus();
//         if (verified) {
//           setMessage(
//             "Email Anda sudah terverifikasi! Mengarahkan ke dashboard..."
//           );
//           setTimeout(() => navigate("/dashboard"), 2000); // Redirect setelah 2 detik
//         }
//       } catch (err) {
//         console.error("Error checking initial verification status:", err);
//         setError("Gagal memeriksa status verifikasi awal.");
//       }
//     };
//     checkInitialStatus();

//     // Set interval untuk mengecek secara periodik (misal setiap 5 detik)
//     // Ini membantu jika user memverifikasi email di tab/device lain
//     const interval = setInterval(async () => {
//       try {
//         const verified = await checkEmailVerificationStatus();
//         if (verified) {
//           setMessage(
//             "Email Anda sudah terverifikasi! Mengarahkan ke dashboard..."
//           );
//           clearInterval(interval); // Hentikan pengecekan
//           setTimeout(() => navigate("/dashboard"), 2000);
//         }
//       } catch (err) {
//         // Abaikan error di interval agar tidak terlalu banyak notifikasi
//         console.warn("Error during periodic verification check:", err);
//       }
//     }, 5000); // Cek setiap 5 detik

//     return () => clearInterval(interval); // Cleanup interval saat komponen di-unmount
//   }, [navigate]);

//   const handleResendEmail = async () => {
//     setLoading(true);
//     setMessage(null);
//     setError(null);
//     try {
//       await resendVerificationEmail();
//       setMessage(
//         "Email verifikasi telah dikirim ulang! Silakan periksa kotak masuk Anda (termasuk folder spam)."
//       );
//     } catch (err: any) {
//       console.error("Error resending verification email:", err);
//       setError(err.message || "Gagal mengirim ulang email verifikasi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleContinue = async () => {
//     setLoading(true);
//     setMessage(null);
//     setError(null);
//     try {
//       const verified = await checkEmailVerificationStatus();
//       if (verified) {
//         setMessage(
//           "Email Anda sudah terverifikasi! Mengarahkan ke dashboard..."
//         );
//         setTimeout(() => navigate("/dashboard"), 1500);
//       } else {
//         setMessage(
//           "Email Anda belum terverifikasi. Pastikan Anda telah mengklik link di email."
//         );
//       }
//     } catch (err: any) {
//       console.error("Error checking verification status:", err);
//       setError(err.message || "Gagal memeriksa status verifikasi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg text-card-foreground">
//         <h1 className="text-2xl font-bold text-center mb-4">
//           Verifikasi Email Anda
//         </h1>
//         <p className="text-center text-muted-foreground mb-6">
//           Kami telah mengirimkan tautan verifikasi ke alamat email Anda. Silakan
//           periksa kotak masuk Anda (dan folder spam/junk) untuk melanjutkan.
//         </p>

//         {message && (
//           <Alert className="mb-4">
//             <AlertTitle>Info</AlertTitle>
//             <AlertDescription>{message}</AlertDescription>
//           </Alert>
//         )}

//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <div className="flex flex-col gap-4">
//           <Button onClick={handleContinue} disabled={loading}>
//             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Saya Sudah Verifikasi Email
//           </Button>
//           <Button
//             variant="outline"
//             onClick={handleResendEmail}
//             disabled={loading}
//           >
//             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Kirim Ulang Email Verifikasi
//           </Button>
//         </div>

//         <p className="text-center text-sm text-muted-foreground mt-6">
//           Kembali ke{" "}
//           <a href="/login" className="underline underline-offset-4">
//             Masuk
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
