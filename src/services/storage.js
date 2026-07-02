// localStorage persistence for client-only state (cart, favorites).
// Server data lives in Supabase — see the other files in src/services.
const PREFIX = "bt-admin-";

export function readCollection(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) {
      writeCollection(key, fallback);
      return structuredCloneSafe(fallback);
    }
    return JSON.parse(raw);
  } catch {
    return structuredCloneSafe(fallback);
  }
}

export function writeCollection(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable, edits won't persist across refresh */
  }
}

function structuredCloneSafe(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}
