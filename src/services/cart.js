import { readCollection, writeCollection } from "./storage.js";
import { generateId } from "../utils/id.js";

const KEY = "cart";

function load() {
  return readCollection(KEY, []);
}

function save(list) {
  writeCollection(KEY, list);
}

export function getCart() {
  return load();
}

export function addCartItem(item) {
  const list = load();
  list.push({ id: generateId("cart"), ...item });
  save(list);
  return list;
}

export function updateCartItemQty(id, qty) {
  const list = load();
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return list;
  if (qty <= 0) {
    list.splice(idx, 1);
  } else {
    list[idx] = { ...list[idx], qty };
  }
  save(list);
  return list;
}

export function removeCartItem(id) {
  const list = load().filter((i) => i.id !== id);
  save(list);
  return list;
}

export function clearCart() {
  save([]);
  return [];
}
