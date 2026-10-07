import { useEffect, useRef, useState, type UIEvent } from "react";
import { getPage } from "../../shared/api/client";

type Props = {
  side: "left" | "right";
  filter: string;
  version: number;
  onItemClick: (id: number) => void;
  onChange?: () => void;
};

export function ItemList({
  side,
  filter,
  version,
  onItemClick,
  onChange,
}: Props) {
  const [items, setItems] = useState<number[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const loading = useRef(false);
  const draggedItemId = useRef<number | null>(null);

  // первая 20 при открытии/сменен фильтра
  useEffect(() => {
    getPage(side, filter, null).then((page) => {
      setItems(page.items);
      setCursor(page.nextCursor);
    });
  }, [side, filter, version]);

  // подгрузка при прокрутке до конца
  async function handleScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
    if (!atBottom || cursor === null || loading.current) return;

    loading.current = true;
    const page = await getPage(side, filter, cursor);
    setItems((prev) => [...prev, ...page.items]);
    setCursor(page.nextCursor);
    loading.current = false;
  }

  async function handleDragge(id: number) {
    const elem = draggedItemId.current;
    draggedItemId.current = 0;
    if (elem === null || elem === id) return;
    // тащили вниз?ставим после цели, вверх-перед
    const place = items.indexOf(elem) < items.indexOf(id) ? "after" : "before";

    await fetch("/api/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: elem, targetId: id, place }),
    });
    onChange?.();
  }

  return (
    <div onScroll={handleScroll} className="h-120 overflow-y-auto">
      {items.map((id) => (
        <div
          key={id}
          draggable
          onDragStart={() => (draggedItemId.current = id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDragge(id)}
          onClick={() => onItemClick(id)}
          className="px-3 py-1.5 mb-1 bg-pixel-bg border-2 border-pixel-border cursor-pointer hover:border-pixel-accent hover:text-pixel-accent"
        >
          штука {id}
        </div>
      ))}
    </div>
  );
}
