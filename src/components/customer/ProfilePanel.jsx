import { createPortal } from "react-dom";
import { X, Phone, Clock, MapPin, ChevronRight } from "lucide-react";
import IconButton from "./IconButton.jsx";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" {...props}>
      <path d="M16.6 3h-3.2v12.1a2.9 2.9 0 1 1-2.1-2.79V9.1a6 6 0 1 0 5.3 5.95V9.4a7.6 7.6 0 0 0 4.4 1.4V7.6a4.3 4.3 0 0 1-4.4-4.3V3Z" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.55L3 21l2.05-5.4A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

const BRANCHES = ["Xırdalan", "Masazır"];

function mapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, Azərbaycan`)}`;
}

export default function ProfilePanel({ isOpen, settings, onClose }) {
  if (!isOpen || !settings) return null;
  const { general, social } = settings;

  return createPortal(
    <div className="dark fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-[400px] flex-col bg-surface text-text shadow-2xl animate-[drawer-in_0.35s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hair px-5 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.png" alt={general.restaurantName} className="h-9 w-9 rounded-full object-cover" />
            <span className="font-(--font-display) text-lg font-semibold text-text">{general.restaurantName}</span>
          </div>
          <IconButton onClick={onClose} size="sm" aria-label="Bağla">
            <X size={16} />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="text-sm leading-relaxed text-text-dim">
            Biz tantuni sənətini butik yanaşma ilə birləşdirərək ən yüksək keyfiyyətli xidmət təklif edirik. Təzə
            içliklər, sürətli çatdırılma və qulluq mədəniyyəti ilə fərqlənirik.
          </p>

          {social.instagram || social.tiktok ? (
            <div className="mt-4 flex gap-2">
              {social.instagram && (
                <IconButton
                  as="a"
                  href={`https://instagram.com/${social.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="bg-[#E1306C]/10! text-[#E1306C]! hover:bg-[#E1306C]! hover:text-white!"
                >
                  <InstagramIcon />
                </IconButton>
              )}
              {social.tiktok && (
                <IconButton
                  as="a"
                  href={`https://tiktok.com/${social.tiktok.replace(/^@?/, "@")}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </IconButton>
              )}
            </div>
          ) : null}

          <div className="mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-dim">Əlaqə</h4>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${general.phone}`}
                className="flex items-center gap-3 rounded-xl border border-hair px-3.5 py-3 text-sm text-text transition-colors hover:bg-surface-2"
              >
                <Phone size={16} className="shrink-0 text-accent" />
                {general.phone}
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-hair px-3.5 py-3 text-sm text-text">
                <Clock size={16} className="shrink-0 text-accent" />
                {general.workingHours}
              </div>
              {general.whatsapp1 && (
                <a
                  href={`https://wa.me/${general.whatsapp1}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-hair px-3.5 py-3 text-sm text-text transition-colors hover:bg-surface-2"
                >
                  <WhatsAppIcon className="shrink-0 text-[#25D366]" />
                  WhatsApp — {general.whatsapp1}
                </a>
              )}
              {general.whatsapp2 && (
                <a
                  href={`https://wa.me/${general.whatsapp2}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-hair px-3.5 py-3 text-sm text-text transition-colors hover:bg-surface-2"
                >
                  <WhatsAppIcon className="shrink-0 text-[#25D366]" />
                  WhatsApp — {general.whatsapp2}
                </a>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-dim">Filiallar</h4>
            <div className="flex flex-col gap-2">
              {BRANCHES.map((branch) => (
                <a
                  key={branch}
                  href={mapsUrl(branch)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-hair px-3.5 py-3 text-sm text-text transition-colors hover:bg-surface-2"
                >
                  <MapPin size={16} className="shrink-0 text-accent" />
                  <span className="flex-1">{branch}</span>
                  <ChevronRight size={15} className="shrink-0 text-text-dim" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
