import { useRef } from "react";
import { Upload } from "lucide-react";

export default function ImageUpload({ value, onChange, label }) {
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-text">{label}</span>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-hair bg-surface-2 text-text-dim transition-colors hover:border-accent"
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full rounded-xl object-cover" />
        ) : (
          <>
            <Upload size={20} />
            <span className="text-xs">Şəkil yükləmək üçün klikləyin</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
