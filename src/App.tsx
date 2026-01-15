import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/views/login";
import Register from "@/views/register";
import ForgotPassword from "@/views/forgot-password";
import Dashboard from "@/views/dashboard";
import BarangDanStok from "@/views/barang-dan-stok";
import MaterialRequest from "@/views/material-request";
import { MaterialRequestDetail } from "@/views/material-request/[kode]";
import ReceiveItem from "@/views/receive-item";
import { ReceiveDetail } from "@/views/receive-item/[kode]";
import DeliveryPage from "@/views/delivery";
import { DeliveryDetail } from "@/views/delivery/[kode]";
import PurchaseRequest from "@/views/purchase-request";
import PurchaseOrder from "@/views/purchase-order";
import PurchaseOrderDetail from "@/views/purchase-order/[kode]";
import UserManagement from "@/views/user-management";
import NotFound from "@/views/not-found";
import { PurchaseRequestDetail } from "./views/purchase-request/[kode]";
import Setting from "./views/setting/index.tsx";
import MasterVendorPage from "@/views/vendor";
import MasterCustomerPage from "@/views/customer";
import MRSign from "@/views/mr-sign";
import PRSign from "@/views/pr-sign";
import POSign from "@/views/po-sign";
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
         

          {/* ================= ROOT ================= */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* ================= DASHBOARD ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= BARANG & STOK ================= */}
          <Route
            path="/barang-dan-stok"
            element={
              <ProtectedRoute>
                <BarangDanStok />
              </ProtectedRoute>
            }
          />

          {/* ================= MATERIAL REQUEST ================= */}
          <Route
            path="/material-request"
            element={
              <ProtectedRoute>
                <MaterialRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mr/kode/:kode"
            element={
              <ProtectedRoute>
                <MaterialRequestDetail />
              </ProtectedRoute>
            }
          />
<Route path="/mr-sign/:kode" element={<MRSign />} />

          {/* ================= RECEIVE ================= */}
          <Route
            path="/receive-item"
            element={
              <ProtectedRoute>
                <ReceiveItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receive/kode/:kode"
            element={
              <ProtectedRoute>
                <ReceiveDetail />
              </ProtectedRoute>
            }
          />

          {/* ================= DELIVERY ================= */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute>
                <DeliveryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deliveries/kode/:kode"
            element={
              <ProtectedRoute>
                <DeliveryDetail />
              </ProtectedRoute>
            }
          />

          {/* ================= PURCHASE ================= */}
          <Route
            path="/purchase-request"
            element={
              <ProtectedRoute>
                <PurchaseRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pr/kode/:kode"
            element={
              <ProtectedRoute>
                <PurchaseRequestDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-order"
            element={
              <ProtectedRoute>
                <PurchaseOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/po/kode/:kode"
            element={
              <ProtectedRoute>
                <PurchaseOrderDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/po-sign/:kode" element={<POSign />} />
          <Route path="/pr-sign/:kode" element={<PRSign />} />
   {/* ================= Vendor ================= */}
          <Route
            path="/vendors"
            element={
              <ProtectedRoute>
                <MasterVendorPage />
              </ProtectedRoute>
            }
          />

            {/* ================= Customer ================= */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <MasterCustomerPage/>
              </ProtectedRoute>
            }
          />
          {/* ================= USER MANAGEMENT ================= */}
          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/setting" element={<Setting />} />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
