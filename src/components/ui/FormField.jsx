export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  as = "input",
  options,
  className = "",
  ...rest
}) {
  const baseInputClass = `w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent ${
    error ? "border-red-500" : "border-hair"
  }`;

  return (
    <label className={`block text-sm ${className}`}>
      {label && (
        <span className="mb-1.5 block font-medium text-text">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      {as === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseInputClass} min-h-[90px] resize-y`}
          {...rest}
        />
      ) : as === "select" ? (
        <select name={name} value={value} onChange={onChange} className={baseInputClass} {...rest}>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={baseInputClass}
          {...rest}
        />
      )}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
