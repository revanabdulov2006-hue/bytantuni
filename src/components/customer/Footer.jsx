import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, ShieldCheck } from "lucide-react";
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

export default function Footer({ settings }) {
  if (!settings) return null;
  const { general, social } = settings;

  return (
    <footer className="mt-10 border-t border-hair px-4 py-10">
      <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/favicon.png" alt={general.restaurantName} className="h-9 w-9 rounded-full object-cover" />
            <span className="font-(--font-display) text-lg font-semibold text-text">
              {general.restaurantName}
            </span>
          </div>
          <p className="mt-3 text-sm text-text-dim">
            Biz tantuni sənətini butik yanaşma ilə birləşdirərək ən yüksək keyfiyyətli xidmət təklif edirik.
          </p>
          <div className="mt-4 flex gap-2">
            {social.instagram && (
              <IconButton as="a" href={`https://instagram.com/${social.instagram}`} target="_blank" rel="noreferrer" tone="accent">
                <InstagramIcon />
              </IconButton>
            )}
            {social.tiktok && (
              <IconButton
                as="a"
                href={`https://tiktok.com/${social.tiktok.replace(/^@?/, "@")}`}
                target="_blank"
                rel="noreferrer"
              >
                <TikTokIcon />
              </IconButton>
            )}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-text">Ünvan</h4>
          <p className="flex items-start gap-2 text-sm text-text-dim">
            <MapPin size={15} className="mt-0.5 shrink-0 text-accent" />
            {general.address}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-text-dim">
            <Clock size={15} className="shrink-0 text-accent" />
            {general.workingHours}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-text">Sifariş &amp; Dəstək</h4>
          <p className="flex items-center gap-2 text-sm text-text-dim">
            <Phone size={15} className="shrink-0 text-accent" />
            {general.phone}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between border-t border-hair pt-5 text-xs text-text-dim">
        <span>
          © {new Date().getFullYear()} {general.restaurantName}. Bütün hüquqlar qorunur.
        </span>
        <Link to="/admin/dashboard" className="flex items-center gap-1.5 hover:text-text">
          <ShieldCheck size={14} />
          Admin
        </Link>
      </div>
    </footer>
  );
}
