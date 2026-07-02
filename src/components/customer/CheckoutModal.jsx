import { useState } from "react";
import { createPortal } from "react-dom";
import { X, MapPin } from "lucide-react";
import IconButton from "./IconButton.jsx";
import { formatPrice } from "../../utils/format.js";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../../utils/whatsapp.js";

export default function CheckoutModal({ isOpen, items, total, whatsappNumber, onClose, onSubmitted }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  function requestLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        name: i.name,
        variant: i.variant,
        qty: i.qty,
        price: i.unitPrice,
      }));
      await onSubmitted({
        customerName: name,
        phone,
        address,
        note,
        items: orderItems,
        total,
      });
      const message = buildWhatsAppMessage({
        items: orderItems,
        total,
        note,
        location,
        customerName: name,
        phone,
        address,
      });
      window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank", "noopener");
    } catch {
      /* error toast shown by the page; keep the modal open, skip WhatsApp */
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="dark fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="flex max-h-[92svh] w-full flex-col overflow-y-auto rounded-t-3xl bg-surface text-text shadow-2xl animate-[sheet-in_0.35s_cubic-bezier(0.16,1,0.3,1)] sm:max-w-md sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-hair px-5 py-4">
          <h3 className="font-(--font-display) text-lg font-semibold">Sifarişi tamamla</h3>
          <IconButton onClick={onClose} size="sm" aria-label="Bağla">
            <X size={16} />
          </IconButton>
        </div>

        <form className="flex flex-col gap-3 px-5 py-4" onSubmit={handleSubmit}>
          <input
            required
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-hair bg-surface-2 px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
          <input
            required
            placeholder="Telefon nömrəsi"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-hair bg-surface-2 px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
          <div className="flex gap-2">
            <input
              placeholder="Ünvan"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full flex-1 rounded-xl border border-hair bg-surface-2 px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={requestLocation}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 active:scale-90 ${
                location ? "border-accent bg-accent/10 text-accent" : "border-hair text-text-dim hover:bg-surface-2"
              }`}
              aria-label="Məkanı paylaş"
            >
              <MapPin size={16} />
            </button>
          </div>
          <textarea
            placeholder="Qeyd (istəyə görə)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[70px] w-full resize-y rounded-xl border border-hair bg-surface-2 px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent"
          />

          <div className="mt-1 flex items-center justify-between border-t border-hair pt-3">
            <span className="text-sm text-text-dim">Toplam</span>
            <span className="text-lg font-bold text-text">{formatPrice(total)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-14 w-full rounded-2xl bg-[#25D366] text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,.6)] transition-all duration-200 hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? "Göndərilir..." : "WhatsApp ilə sifariş ver"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
