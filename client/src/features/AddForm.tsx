import { useState } from "react";
import { PixelButton, PixelInput } from "../shared/ui";


type Props = { onAdded: () => void };

export function AddForm({ onAdded }: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");



  async function handleAdd() {
    if (!value) return;

    setStatus("добавляется...");
    
    const result = await fetch("/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(value) }),
    }).then((res) => res.json());
    

    if (result.ok) {
      setStatus(`#${value} добавлен`);
      setValue("");
      onAdded();
    } else if (result.error?.code === "duplicate_item") {
      setStatus(`#${value} уже существует`);
    } else {
      setStatus("ошибка");
    }
  }

  return (
    <div className="mb-3">
      <div className="flex gap-2">
        <PixelInput
          value={value}
          onChange={(v) => setValue(v.replace(/\D/g, ""))}
          placeholder="new id..."
        />
        <PixelButton onClick={handleAdd} disabled={status === "добавляется..."}>
          Add
        </PixelButton>
      </div>
      {status && <p className="font-pixel text-[9px] text-pixel-warning mt-2">{status}</p>}
    </div>
  );
}