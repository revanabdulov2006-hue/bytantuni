export function required(value) {
  if (value === null || value === undefined) return "Bu sahə vacibdir";
  if (typeof value === "string" && value.trim() === "") return "Bu sahə vacibdir";
  return null;
}

export function positiveNumber(value) {
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) return "Müsbət ədəd daxil edin";
  return null;
}

export function validate(values, rules) {
  const errors = {};
  for (const field in rules) {
    for (const rule of rules[field]) {
      const message = rule(values[field]);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
}
