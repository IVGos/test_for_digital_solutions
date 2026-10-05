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
  const order: number[] = []; // правый список
  const selected = new Set<number>(); // выбранные
  const added: number[] = []; // левый список с доьавлением по возрастаниб
  const addedSet = new Set<number>(); // проверка дублей

  function isValidId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
  }
  function checkExists(id: number): boolean {
    return (id <= baseSize && id > 0) || addedSet.has(id);
  }

  function matchesFilter(id: number, filter: string): boolean {
    return filter === "" || String(id).includes(filter);
  }

  function fits(id: number, filter: string): boolean {
    return !selected.has(id) && matchesFilter(id, filter);
  }

  function getLeftItems(filter: string, cursor: number | null): Page {
    const items: number[] = [];
    const start = cursor ?? 0;

    //  курсор от начала до baseSize.
    for (let id = start + 1; id <= baseSize && items.length < PAGE_SIZE; id++) {
      if (fits(id, filter)) items.push(id);
    }

    // добавленные элементы, которые больше курсора и соответствуют фильтру
    for (const id of added) {
      if (items.length >= PAGE_SIZE) break;
      if (fits(id, filter) && id > start) items.push(id);
    }

    // определяем следующий курсор
    const nextCursor =
      items.length === PAGE_SIZE ? (items.at(-1) ?? null) : null;
    return { items, nextCursor };
  }

  function getRightItems(filter: string, cursor: number | null): Page {
    const items: number[] = [];
    const start = cursor === null ? 0 : order.indexOf(cursor) + 1;

    for (let i = start; i < order.length && items.length < PAGE_SIZE; i++) {
      const id = order[i]!;
      if (matchesFilter(id, filter)) items.push(id);
    }

    const nextCursor =
      items.length === PAGE_SIZE ? (items.at(-1) ?? null) : null;
    return { items, nextCursor };
  }

  function selectItem(id: number): Result {
    if (!checkExists(id)) return { ok: false, error: "item_not_found" }; // id нет
    if (selected.has(id)) return { ok: true }; // уже выбран

    selected.add(id);
    order.push(id);
    return { ok: true };
  }
  // вытащить и вставить
  function moveItem(id: number, targetId: number, place: Place): Result {
    if (!selected.has(id) || !selected.has(targetId)) {
      return { ok: false, error: "not_selected" };
    }
    if (id === targetId) return { ok: true };

    order.splice(order.indexOf(id), 1);
    const targetIndex = order.indexOf(targetId);
    const insertAt = place === "before" ? targetIndex : targetIndex + 1;
    order.splice(insertAt, 0, id);
    return { ok: true };
  }

  function deselectItem(id: number): Result {
    if (!selected.has(id)) return { ok: true }; // не выбран

    selected.delete(id);
    order.splice(order.indexOf(id), 1);
    return { ok: true };
  }

  // проверка перед добавлением
  function addItem(id: number): Result {
    if (!isValidId(id)) return { ok: false, error: "invalid_id" };
    if (checkExists(id)) return { ok: false, error: "duplicate_item" };

    addedSet.add(id);
    added.push(id);
    added.sort((a, b) => a - b);
    return { ok: true };
  }
  return {
    getLeftItems,
    getRightItems,
    selectItem,
    deselectItem,
    addItem,
    moveItem,
  };
}


export type RootStore = ReturnType<typeof createStore>;
