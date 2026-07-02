import { Home, Heart, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";

export default function BottomTabBar({ onFavoritesClick, onSearchClick, onProfileClick }) {
  const { count, openCart } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-hair bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      <button className="flex flex-col items-center gap-1 text-[10px] font-medium text-accent transition-transform active:scale-90">
        <Home size={20} className="fill-accent/15" />
        Home
      </button>
      <button
        onClick={onFavoritesClick}
        className="flex flex-col items-center gap-1 text-[10px] font-medium text-text-dim transition-transform active:scale-90"
      >
        <Heart size={20} />
        Favorites
      </button>
      <button
        onClick={onSearchClick}
        className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_-8px_rgba(242,121,10,.6)] transition-transform active:scale-90"
        aria-label="Axtar"
      >
        <Search size={21} />
      </button>
      <button
        onClick={openCart}
        className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-text-dim transition-transform active:scale-90"
      >
        <ShoppingBag size={20} />
        Cart
        {count > 0 && (
          <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-white">
            {count}
          </span>
        )}
      </button>
      <button
        onClick={onProfileClick}
        className="flex flex-col items-center gap-1 text-[10px] font-medium text-text-dim transition-transform active:scale-90"
      >
        <User size={20} />
        Profile
      </button>
    </nav>
  );
}
