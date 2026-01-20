import {
  FileText,
  Package,
  Clock,
  Truck,
  CheckCircle,
  Check,
} from "lucide-react";

/* ================= TYPE ================= */
export type DeliveryStatus =
  | "pending"
  | "packing"
  | "ready to pickup"
  | "on delivery"
  | "delivered";

interface DeliveryTimelineProps {
  status: DeliveryStatus;
  isHandCarry?: boolean;
}

/* ================= BASE STEPS ================= */
const BASE_STEPS = [
  {
    key: "pending",
    label: "Delivery dibuat",
    desc: "Delivery telah dibuat",
    icon: FileText,
  },
  {
    key: "packing",
    label: "Packing",
    desc: "Barang sedang dikemas",
    icon: Package,
  },
  {
    key: "ready to pickup",
    label: "Siap diambil",
    desc: "Menunggu pengambilan",
    icon: Clock,
  },
  {
    key: "on delivery",
    label: "Dalam pengiriman",
    desc: "Barang dikirim",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Barang diterima",
    desc: "Pengiriman selesai",
    icon: CheckCircle,
  },
];

/* ================= COMPONENT ================= */
export function DeliveryTimeline({
  status,
  isHandCarry = false,
}: DeliveryTimelineProps) {
  /* 🔥 FILTER STEP UNTUK HAND CARRY */
  const steps = isHandCarry
    ? BASE_STEPS.filter(
        (s) => s.key !== "ready to pickup" && s.key !== "on delivery"
      )
    : BASE_STEPS;

  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="w-full bg-white border rounded-lg p-6">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isDone = index < currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* LINE */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 right-[-50%] w-full h-[3px]
                    ${
                      isDone
                        ? "bg-green-500"
                        : isActive
                        ? "bg-blue-300"
                        : "bg-gray-300"
                    }`}
                />
              )}

              {/* CIRCLE */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center
                  z-10 shadow-sm
                  ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {isDone ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* TEXT */}
              <div className="mt-3 text-center max-w-[170px]">
                <p
                  className={`text-sm font-semibold ${
                    isDone || isActive
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
