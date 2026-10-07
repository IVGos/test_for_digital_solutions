import { useState } from "react";
import { PixelBox, PixelInput } from "../shared/ui";
import { ItemList } from "../widgets/item-list/ItemList";
import { useDebounce } from "../shared/lib/useDebounnce";
import { selectItem, deselectItem } from "../shared/api/client";
import { AddForm } from "../features/AddForm";

export function App() {
  const [leftFilter, setLeftFilter] = useState("");
  const [rightFilter, setRightFilter] = useState("");
  const [version, setVersion] = useState(0);

  const leftSearch = useDebounce(leftFilter);
  const rightSearch = useDebounce(rightFilter);

  async function handleSelect(id: number) {
    await selectItem(id);
    setVersion((v) => v + 1);
  }

  async function handleDeselect(id: number) {
    await deselectItem(id);
    setVersion((v) => v + 1);
  }

  return (
    <div className="h-screen flex flex-col p-6 gap-4">
      <h1 className="font-pixel text-sm text-pixel-accent pixel-cursor">
        {">IVGos test for DIGITAL_SOLUTIONS"}
      </h1>

      <main className="grid grid-cols-2 gap-4">
        <PixelBox>
          <h2 className="font-pixel text-[10px] text-pixel-text-dim mb-3">
            {"LEFT LIST"}
          </h2>
          <AddForm onAdded={() => setVersion((v) => v + 1)} />
          <PixelInput
            value={leftFilter}
            onChange={(v) => setLeftFilter(v.replace(/\D/g, ""))}
            placeholder="filter by id..."
          />
          <div className="mt-3">
            <ItemList
              side="left"
              filter={leftSearch}
              version={version}
              onItemClick={handleSelect}
              
            />
          </div>
        </PixelBox>

        <PixelBox>
          <h2 className="font-pixel text-[10px] text-pixel-gold mb-3">
            {"RIGHT LIST"}
          </h2>
          <PixelInput
            value={rightFilter}
            onChange={(v) => setRightFilter(v.replace(/\D/g, ""))}
            placeholder="input filter by id"
          />
          <div className="mt-3">
            <ItemList
              side="right"
              filter={rightSearch}
              version={version}
              onItemClick={handleDeselect}
              onChange={() => setVersion((v) => v + 1)}
            />
          </div>
        </PixelBox>
      </main>
    </div>
  );
}
