import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import IconButton from "./IconButton.jsx";

export default function TopNav({ onSearchClick, whatsappNumber }) {
  const { count, openCart } = useCart();

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-hair bg-bg/90 px-4 py-3.5 backdrop-blur">
      <div className="flex items-center gap-2 font-(--font-display) text-lg font-semibold tracking-tight text-text">
        <img src="/favicon.png" alt="BY TANTUNI" className="h-8 w-8 rounded-full object-cover" />
        BY TANTUNI
      </div>
      <div className="flex items-center gap-1.5">
        <IconButton onClick={onSearchClick} aria-label="Axtar">
          <Search size={18} />
        </IconButton>
        {whatsappNumber && (
          <IconButton
            as="a"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="bg-[#25D366]/10! text-[#25D366]! hover:bg-[#25D366]! hover:text-white!"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.55L3 21l2.05-5.4A8.5 8.5 0 1 1 21 11.5Z" />
            </svg>
          </IconButton>
        )}
        <IconButton onClick={openCart} aria-label="Səbət" className="relative">
          <ShoppingBag size={18} />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </IconButton>
      </div>
    </nav>
  );
}
