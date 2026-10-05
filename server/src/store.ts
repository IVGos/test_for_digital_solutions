export const PAGE_SIZE = 20;
export const BASE_SIZE = 1000000;

export type Page = { items: number[]; nextCursor: number | null };
export type Place = "before" | "after";
export type StoreError =
  | "Invalid_id"
  | "Item_not_found"
  | "not_selected"
  | "duplicate_item";
export type Result = { ok: true } | { ok: false; error: StoreError };

export function createStore(baseSize: number = BASE_SIZE) {
  const order = []; // порядок
  const selected = new Set(); // проверка выбран ли ID
  const added = []; // добавленные
  const addedSet = new Set(); // проверка добавлен ли ID

  function isValidId(id: number): boolean {
    return id > 0;
  }
  function checkExists(id: number): boolean {
    return (id <= baseSize && id > 0) || addedSet.has(id);
  }

  function getLeftItems() {
    throw new Error("not implemented");
  }

  function getRightItems() {
    throw new Error("not implemented");
  }

  function selectItem() {
    throw new Error("not implemented");
  }
 function deselectItem(id: number): Result {
    throw new Error('not implemented');
  }
  function addItem() {
    throw new Error("not implemented");
  }
  return{
    getLeftItems,
    getRightItems,
    selectItem,
    deselectItem,
    addItem
  };
}

