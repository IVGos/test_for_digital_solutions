import { useEffect, useRef, useState, type UIEvent } from "react";
import { getPage } from "../../shared/api/client";

type Props = {
  side: "left" | "right";
  filter: string;
};

export function ItemList({ side, filter }: Props) {
  const [items, setItems] = useState<number[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const loading = useRef(false);

  // первая 20 при открытии/сменен фильтра
  useEffect(() => {
    getPage(side, filter, null).then((page) => {
      setItems(page.items);
      setCursor(page.nextCursor);
    });
  }, [side, filter]);

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

  return (
    <div onScroll={handleScroll} className="h-120 overflow-y-auto">
      {items.map((id) => (
        <div
          key={id}
          className="px-3 py-1.5 mb-1 bg-pixel-bg border-2 border-pixel-border"
        >
          #{id}
        </div>
      ))}
    </div>
  );
}
