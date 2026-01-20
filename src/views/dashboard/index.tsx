import { useEffect, useMemo, useState } from "react";
import WithSidebar from "@/components/layout/WithSidebar";
import SectionContainer, {
  SectionHeader,
  SectionBody,
} from "@/components/content-container";

import { getDashboardData } from "@/services/dashboard";
import { useAuth } from "@/context/AuthContext";

import type { DashboardResponse } from "@/types";
import { PagingSize } from "@/types/enum";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MyPagination } from "@/components/my-pagination";
import { Printer } from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  open: "#facc15",
  pending: "#facc15",
  close: "#22c55e",
  delivered: "#22c55e",
  "on delivery": "#3b82f6",
  received: "#22c55e",
};

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "close" || status === "delivered" || status === "received"
      ? "bg-green-100 text-green-700"
      : status === "on delivery"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {status.toUpperCase()}
    </span>
  );
}

function AlertCard({
  icon,
  title,
  value,
  desc,
  color,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  value: number;
  desc: string;
  color: "yellow" | "blue";
  active: boolean;
  onClick: () => void;
}) {
  const map = {
    yellow: "bg-yellow-50 border-yellow-300 text-yellow-800",
    blue: "bg-blue-50 border-blue-300 text-blue-800",
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-md p-4 cursor-pointer transition
        ${map[color]}
        ${active ? "ring-2 ring-offset-2 ring-black/20" : ""}
      `}
    >
      <p className="text-sm font-medium">
        {icon} {title}
      </p>
      <p className="text-3xl font-bold my-1">{value}</p>
      <p className="text-xs">{desc}</p>
    </div>
  );
}

function DashboardTable({ title, data }: { title: string; data: any[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const headers = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(
      (k) => !k.endsWith("_id") && k !== "id"
    );
  }, [data]);

  const filtered = useMemo(() => {
    let result = [...(data ?? [])];
    if (search) {
      result = result.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    return result;
  }, [data, search]);

  const start = (page - 1) * PagingSize;
  const pageData = filtered.slice(start, start + PagingSize);

  return (
    <div className="border rounded-md p-4 my-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <p className="font-semibold">{title}</p>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.print()}
          className="print:hidden"
        >
          <Printer className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-4 print:hidden">
        <Input
          placeholder="Cari data..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm border">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="border px-3 py-2 text-left text-xs text-muted-foreground"
                >
                  {h.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                {headers.map((k) => (
                  <td key={k} className="border px-3 py-2">
                    {k.includes("status") ? (
                      <StatusBadge status={String(row[k]).toLowerCase()} />
                    ) : (
                      String(row[k] ?? "-")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 print:hidden">
        <MyPagination
          data={filtered}
          currentPage={page}
          triggerNext={() => setPage((p) => p + 1)}
          triggerPrevious={() => setPage((p) => p - 1)}
          triggerPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [activeAlert, setActiveAlert] = useState<
    "mr" | "delivery" | null
  >(null);

  useEffect(() => {
    async function loadDashboard() {
      const d = await getDashboardData();
      setDashboard(d);
    }
    if (user) loadDashboard();
  }, [user]);

  if (!dashboard || !user) {
    return (
      <WithSidebar>
        <div className="p-6">Loading dashboard...</div>
      </WithSidebar>
    );
  }

  const mrData = dashboard.details.latest_mr.filter(
    (m: any) =>
      m.mr_lokasi?.toLowerCase() === user.lokasi?.toLowerCase()
  );

  const deliveryData = dashboard.details.latest_delivery.filter(
    (d: any) =>
      d.dlv_ke_gudang?.toLowerCase() === user.lokasi?.toLowerCase()
  );

  const receiveData = dashboard.details.latest_receive.filter(
    (r: any) =>
      r.ri_lokasi?.toLowerCase() === user.lokasi?.toLowerCase()
  );

  const now = new Date();

  const mrNearDue = mrData.filter((m: any) => {
    if (m.mr_status !== "open") return false;
    const due = new Date(m.mr_due_date);
    return (due.getTime() - now.getTime()) / 86400000 <= 2;
  }).length;

  const pendingDelivery = deliveryData.filter(
    (d: any) => d.dlv_status === "on delivery"
  ).length;

  const filteredMR =
    activeAlert === "mr"
      ? mrData.filter((m: any) => m.mr_status === "open")
      : mrData;

  const filteredDelivery =
    activeAlert === "delivery"
      ? deliveryData.filter((d: any) => d.dlv_status === "on delivery")
      : deliveryData;

  const filteredReceive = receiveData;

  const chartData = [
    { name: "MR Open", value: filteredMR.length, status: "open" },
    { name: "Delivery", value: filteredDelivery.length, status: "on delivery" },
    { name: "Receive", value: filteredReceive.length, status: "received" },
  ];

  return (
    <WithSidebar>
      <SectionContainer span={12}>
        <SectionHeader>
          Dashboard Gudang — {user.lokasi}
        </SectionHeader>
      </SectionContainer>

      {/* ALERT */}
      <SectionContainer span={12}>
        <SectionHeader>Perlu Perhatian</SectionHeader>
        <SectionBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AlertCard
            icon="⚠️"
            title="MR Hampir Jatuh Tempo"
            value={mrNearDue}
            desc="Due ≤ 2 hari"
            color="yellow"
            active={activeAlert === "mr"}
            onClick={() =>
              setActiveAlert(activeAlert === "mr" ? null : "mr")
            }
          />
          <AlertCard
            icon="🚚"
            title="Delivery Belum Diterima"
            value={pendingDelivery}
            desc="Status on delivery"
            color="blue"
            active={activeAlert === "delivery"}
            onClick={() =>
              setActiveAlert(activeAlert === "delivery" ? null : "delivery")
            }
          />
        </SectionBody>
      </SectionContainer>

      {/* CHART */}
      <SectionContainer span={12}>
        <SectionHeader>Status Ringkas</SectionHeader>
        <SectionBody className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((d, i) => (
                  <Cell key={i} fill={STATUS_COLOR[d.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionBody>
      </SectionContainer>
      {/* TABLES */}
      <SectionContainer span={12}>
        <SectionHeader>Material Request</SectionHeader>
        <SectionBody>
          <DashboardTable title="Latest MR" data={filteredMR} />
        </SectionBody>
      </SectionContainer>
      <SectionContainer span={12}>
        <SectionHeader>Delivery & Receive</SectionHeader>
        <SectionBody>
          <DashboardTable title="Latest Delivery" data={filteredDelivery} />
          <DashboardTable title="Latest Receive" data={filteredReceive} />
        </SectionBody>
      </SectionContainer>
    </WithSidebar>
  );
}
