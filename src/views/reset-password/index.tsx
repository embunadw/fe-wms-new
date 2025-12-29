import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password tidak sama");
      return;
    }
    try {
      await axios.post("/api/reset-password", { token, password });
      setMessage("Password berhasil diubah!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4"> Atur Ulang Kata Sandi</h1>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Atur Ulang Kata Sandi
        </button>
      </form>
    </div>
  );
}
