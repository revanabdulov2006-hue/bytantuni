import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Axtar..." }) {
  return (
    <div className="relative w-full max-w-xs">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-hair bg-surface py-2 pl-9 pr-3 text-sm text-text outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
