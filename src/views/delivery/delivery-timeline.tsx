interface DeliveryTimelineProps {
  status: "pending" | "on delivery" | "delivered";
}

const steps = [
  {
    key: "pending",
    label: "Delivery dibuat",
    desc: "Barang sedang dipersiapkan",
  },
  {
    key: "on delivery",
    label: "Dalam pengiriman",
    desc: "Barang sedang dikirim ke lokasi tujuan",
  },
  {
    key: "delivered",
    label: "Barang diterima",
    desc: "Pengiriman telah selesai",
  },
];

export function DeliveryTimeline({ status }: DeliveryTimelineProps) {
  const normalizedStatus =
    status === "on delivery" ? "on delivery" : status;

  const currentIndex = steps.findIndex(
    (s) => s.key === normalizedStatus
  );

  return (
    <div className="w-full bg-white border rounded-lg p-6">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isDone = index < currentIndex;

          return (
            <div
              key={step.key}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* GARIS KE STEP BERIKUTNYA */}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  text-base font-bold z-10 shadow-sm
                  ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
              >
                {index + 1}
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
                <p className="text-xs text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



