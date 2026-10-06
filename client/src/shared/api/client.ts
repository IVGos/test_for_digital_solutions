export type Page = { items: number[]; nextCursor: number | null };

export async function getPage(side: string, filter: string, cursor: number | null): Promise<Page> {
  let url = `/api/${side}?filter=${filter}`;
  if (cursor !== null) url += `&cursor=${cursor}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function selectItem(id: number): Promise<void> {
  const res = await fetch("/api/select", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deselectItem(id: number): Promise<void> {
  const res = await fetch("/api/deselect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}