const LEVELS = [
  { value: "mild", label: "Yüngül" },
  { value: "medium", label: "Orta" },
  { value: "hot", label: "İtidir" },
];

export default function SpicyLevelControl({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-surface-2 p-1">
      {LEVELS.map((level) => (
        <button
          key={level.value}
          type="button"
          onClick={() => onChange(level.value)}
          className={`rounded-full py-2 text-xs font-semibold transition-colors duration-200 ${
            value === level.value ? "bg-accent text-white" : "text-text-dim hover:text-text"
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
