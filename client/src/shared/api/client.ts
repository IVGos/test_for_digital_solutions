export type Page = { items: number[]; nextCursor: number | null };

export async function getPage(side: string, filter: string, cursor: number | null): Promise<Page> {
  let url = `/api/${side}?filter=${filter}`;
  if (cursor !== null) url += `&cursor=${cursor}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}