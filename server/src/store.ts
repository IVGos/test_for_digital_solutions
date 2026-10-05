export const PAGE_SIZE = 20;
export const BASE_SIZE = 1000000;

export type Page = { items: number[]; nextCursor: number | null };
export type Place = "before" | "after";
export type StoreError =
  | "invalid_id"
  | "item_not_found"
  | "not_selected"
  | "duplicate_item";
export type Result = { ok: true } | { ok: false; error: StoreError };

export function createStore(baseSize: number = BASE_SIZE) {
  const order: number[] = []; // порядок
  const selected = new Set<number>(); // проверка выбран ли ID
  const added: number[] = []; // добавленные
  const addedSet = new Set<number>(); // проверка добавлен ли ID

  function isValidId(id: number): boolean {
    return id > 0;
  }
  function checkExists(id: number): boolean {
    return (id <= baseSize && id > 0) || addedSet.has(id);
  }

  function getLeftItems(filter: string, cursor: number | null): Page {
    const items: number[] = [];
    const start = cursor ?? 0;

    //  курсор от начала до baseSize.
    for (let id = start + 1; id <= baseSize && items.length < PAGE_SIZE; id++) {
      if (filter === "" || String(id).includes(filter)) items.push(id);
    }

    // добавленные элементы, которые больше курсора и соответствуют фильтру
    for (const id of added) {
      if (items.length >= PAGE_SIZE) break;
      if (id > start && (filter === "" || String(id).includes(filter)))
        items.push(id);
    }

    // определяем следующий курсор
    const nextCursor =
      items.length === PAGE_SIZE ? (items.at(-1) ?? null) : null;
    return { items, nextCursor };
  }

  function getRightItems() {
    throw new Error("not implemented");
  }

  function selectItem() {
    throw new Error("not implemented");
  }
  function deselectItem(id: number): Result {
    throw new Error("not implemented");
  }
  function addItem() {
    throw new Error("not implemented");
  }
  return {
    getLeftItems,
    getRightItems,
    selectItem,
    deselectItem,
    addItem,
  };
}
