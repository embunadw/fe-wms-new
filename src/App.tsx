import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BarangDanStok from "@/views/barang-dan-stok";
import ReceiveItem from "@/views/receive-item";
import DeliveryPage from "@/views/delivery";
import MaterialRequest from "@/views/material-request";
import Login from "./views/login/index.tsx";
import { DeliveryDetail } from "./views/delivery/[kode]/index.tsx";
import { ReceiveDetail } from "./views/receive-item/[kode]/index.tsx";
import { MaterialRequestDetail } from "./views/material-request/[kode]/index.tsx";
import NotFound from "@/views/not-found";
import Dashboard from "./views/dashboard/index.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* ROOT */}
        <Route
          path="/"
          element={<Navigate to="/barang-dan-stok" replace />}
        />

        {/* DASHBOARD */}

         <Route path="/dashboard" element={<Dashboard />} />

   {/* MASTER BARANG */}
        <Route path="/receive-item" element={<ReceiveItem />} />
        <Route path="/receive/kode/:kode" element={<ReceiveDetail />} />

        <Route path="/material-request" element={<MaterialRequest />} />
        <Route path="/mr/kode/:kode" element={<MaterialRequestDetail />} />

          {/* MASTER BARANG */}
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/deliveries/kode/:kode" element={<DeliveryDetail />} />

        {/* MASTER BARANG */}
        <Route path="/barang-dan-stok" element={<BarangDanStok />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
