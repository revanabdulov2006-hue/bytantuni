import { formatPrice } from "./format.js";

export function buildWhatsAppMessage({ items, total, note, location, customerName, phone, address }) {
  const lines = [];
  lines.push(`*Yeni sifariş - BY TANTUNI*`);
  if (customerName) lines.push(`Ad: ${customerName}`);
  if (phone) lines.push(`Tel: ${phone}`);
  lines.push("");
  for (const item of items) {
    const variantText = item.variant ? ` (${item.variant})` : "";
    lines.push(`${item.qty} × ${item.name}${variantText} - ${formatPrice(item.price * item.qty)}`);
  }
  lines.push("");
  lines.push(`*Toplam: ${formatPrice(total)}*`);
  if (address) lines.push(`Ünvan: ${address}`);
  if (location) lines.push(`Məkan: https://maps.google.com/?q=${location.lat},${location.lng}`);
  if (note) lines.push(`Qeyd: ${note}`);
  lines.push("");
  lines.push("Pulsuz çatdırılma ✅");
  return lines.join("\n");
}

export function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
