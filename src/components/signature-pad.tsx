import { useEffect, useRef } from "react";
import SignaturePadLib from "signature_pad";
import { Button } from "@/components/ui/button";

type Props = {
  onSave: (signature: string) => void;
};

export default function SignaturePad({ onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePadLib | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // 🔥 FIX RESOLUSI CANVAS UNTUK HP
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);

    padRef.current = new SignaturePadLib(canvas, {
      minWidth: 1,
      maxWidth: 3,
      penColor: "black",
    });

    return () => {
      padRef.current?.off();
    };
  }, []);

  const clear = () => {
    padRef.current?.clear();
  };

  const save = () => {
    if (!padRef.current || padRef.current.isEmpty()) return;
    onSave(padRef.current.toDataURL("image/png"));
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        className="w-full h-40 border rounded-md bg-white touch-none"
      />

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={clear}>
          Clear
        </Button>
        <Button size="sm" onClick={save}>
          Simpan TTD
        </Button>
      </div>
    </div>
  );
}
