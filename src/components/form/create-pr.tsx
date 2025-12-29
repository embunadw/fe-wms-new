// src/components/form/create-pr.tsx
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import type { Dispatch, SetStateAction } from "react";
import type { UserComplete, MRReceive, MasterPart, PRItem } from "@/types";

interface CreatePRProps {
  setRefresh: Dispatch<SetStateAction<boolean>>;
  user: UserComplete;
}

const CreatePRForm = ({ setRefresh, user }: CreatePRProps) => {
  const [mrs, setMrs] = useState<MRReceive[]>([]);
  const [parts, setParts] = useState<MasterPart[]>([]);
  const [items, setItems] = useState<PRItem[]>([]);

  const [selectedMr, setSelectedMr] = useState<MRReceive | null>(null);
  const [selectedPart, setSelectedPart] = useState<MasterPart | null>(null);
  const [qty, setQty] = useState<number>(1);

  // ===== FETCH MR OPEN =====
  useEffect(() => {
    axios.get("/mr/open").then((res) => {
      setMrs(res.data.data || []);
    });
  }, []);

  // ===== FETCH PART =====
  useEffect(() => {
    axios.get("/master-part").then((res) => {
      setParts(res.data.data || []);
    });
  }, []);

  // ===== ADD ITEM =====
  const addItem = () => {
    if (!selectedMr || !selectedPart) return;

    const newItem: PRItem = {
      part_id: Number(selectedPart.part_id), // convert ke number saat submit
      part_number: selectedPart.part_number,
      part_name: selectedPart.part_name,
      satuan: selectedPart.part_satuan,

      mr_id: Number(selectedMr.mr_id), // convert ke number saat submit
      kode_mr: selectedMr.mr_kode,

      qty,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedPart(null);
    setQty(1);
  };

  // ===== REMOVE ITEM =====
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== SUBMIT PR =====
  const submitPR = async () => {
    if (!items.length) return;

    try {
      await axios.post("/pr", {
        order_item: items,
        mrs: [...new Set(items.map((i) => i.kode_mr))],
        user_id: user.id,
      });

      alert("PR berhasil dibuat");
      setItems([]);
      setRefresh(true); // trigger reload di halaman PR
    } catch (error) {
      alert(
        `Gagal submit PR: ${error instanceof Error ? error.message : "Unknown"}`
      );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Create Purchase Request</h2>

      {/* MR Select */}
      <div>
        <label>Pilih MR</label>
        <select
          value={selectedMr?.mr_id ?? ""}
          onChange={(e) =>
            setSelectedMr(
              mrs.find((mr) => mr.mr_id === e.target.value) || null
            )
          }
        >
          <option value="">Pilih MR</option>
          {mrs.map((mr) => (
            <option key={mr.mr_id} value={mr.mr_id}>
              {mr.mr_kode}
            </option>
          ))}
        </select>
      </div>

      {/* Part Select */}
      <div>
        <label>Pilih Part</label>
        <select
          value={selectedPart?.part_id ?? ""}
          onChange={(e) =>
            setSelectedPart(
              parts.find((p) => p.part_id === e.target.value) || null
            )
          }
        >
          <option value="">Pilih Part</option>
          {parts.map((p) => (
            <option key={p.part_id} value={p.part_id}>
              {p.part_name}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label>Qty</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </div>

      {/* Add Item Button */}
      <div>
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Tambah Item
        </button>
      </div>

      {/* Item List */}
      <ul className="border rounded p-2 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between items-center">
            <span>
              {item.part_name} - {item.qty} {item.satuan} ({item.kode_mr})
            </span>
            <button
              onClick={() => removeItem(i)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="text-gray-500">Belum ada item</li>}
      </ul>

      {/* Submit PR */}
      <div>
        <button
          disabled={!items.length}
          onClick={submitPR}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Submit PR
        </button>
      </div>
    </div>
  );
};

export default CreatePRForm;
