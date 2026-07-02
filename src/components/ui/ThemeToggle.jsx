import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-surface text-text-dim transition-colors hover:text-accent"
      aria-label={isDark ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
      title={isDark ? "İşıqlı rejim" : "Qaranlıq rejim"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
