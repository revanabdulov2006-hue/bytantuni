import { readCollection, writeCollection } from "./storage.js";

const KEY = "favorites";

export function getFavorites() {
  return readCollection(KEY, []);
}

export function toggleFavorite(productId) {
  const list = getFavorites();
  const idx = list.indexOf(productId);
  if (idx === -1) list.push(productId);
  else list.splice(idx, 1);
  writeCollection(KEY, list);
  return list;
}
