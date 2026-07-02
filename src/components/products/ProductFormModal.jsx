import { useEffect, useState } from "react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import ImageUpload from "../ui/ImageUpload.jsx";
import Toggle from "../ui/Toggle.jsx";
import { validate, required, positiveNumber } from "../../utils/validators.js";

const EMPTY = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  description: "",
  longDescription: "",
  ingredients: "",
  image: "",
  bestseller: false,
  active: true,
  rating: "",
  reviewCount: "",
  prepTime: "",
  spicyLevel: "",
  sizes: "",
  extras: "",
};

const SPICY_OPTIONS = [
  { value: "", label: "Yoxdur" },
  { value: "mild", label: "Yüngül" },
  { value: "medium", label: "Orta" },
  { value: "hot", label: "İtidir" },
];

function pairsToText(list) {
  return (list || []).map((p) => `${p.name}:${p.delta ?? p.price}`).join(", ");
}

function textToPairs(text, key) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [name, value] = s.split(":").map((p) => p.trim());
      return { name, [key]: Number(value) || 0 };
    });
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, categories, product }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setValues({
        ...product,
        ingredients: (product.ingredients || []).join(", "),
        sizes: pairsToText(product.sizes),
        extras: pairsToText(product.extras),
        spicyLevel: product.spicyLevel || "",
      });
    } else {
      setValues(EMPTY);
    }
    setErrors({});
  }, [product, isOpen]);

  function set(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values, {
      name: [required],
      category: [required],
      price: [required, positiveNumber],
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        oldPrice: values.oldPrice ? Number(values.oldPrice) : null,
        rating: values.rating ? Number(values.rating) : 0,
        reviewCount: values.reviewCount ? Number(values.reviewCount) : 0,
        spicyLevel: values.spicyLevel || null,
        ingredients: values.ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        sizes: textToPairs(values.sizes, "delta"),
        extras: textToPairs(values.extras, "price"),
      });
      onClose();
    } catch {
      /* error toast shown by the page; keep the modal open */
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Məhsulu redaktə et" : "Yeni məhsul"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Yadda saxlanılır..." : "Yadda saxla"}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <ImageUpload
          label="Şəkil"
          value={values.image}
          onChange={(v) => set("image", v)}
        />
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="Ad"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            error={errors.name}
          />
          <FormField
            label="Kateqoriya"
            as="select"
            required
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            error={errors.category}
            options={[{ value: "", label: "Seçin" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]}
          />
        </div>
        <FormField
          label="Qiymət (₼)"
          type="number"
          step="0.01"
          required
          value={values.price}
          onChange={(e) => set("price", e.target.value)}
          error={errors.price}
        />
        <FormField
          label="Köhnə qiymət (₼, endirim üçün)"
          type="number"
          step="0.01"
          value={values.oldPrice}
          onChange={(e) => set("oldPrice", e.target.value)}
        />
        <FormField
          label="İnqrediyentlər (vergüllə ayırın)"
          className="sm:col-span-2"
          value={values.ingredients}
          onChange={(e) => set("ingredients", e.target.value)}
        />
        <FormField
          className="sm:col-span-2"
          label="Qısa təsvir"
          as="textarea"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <FormField
          className="sm:col-span-2"
          label="Ətraflı təsvir"
          as="textarea"
          value={values.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
        />
        <FormField
          label="Reytinq (0-5)"
          type="number"
          step="0.1"
          value={values.rating}
          onChange={(e) => set("rating", e.target.value)}
        />
        <FormField
          label="Rəy sayı"
          type="number"
          value={values.reviewCount}
          onChange={(e) => set("reviewCount", e.target.value)}
        />
        <FormField
          label="Hazırlanma müddəti"
          placeholder="məs. 20 dəq"
          value={values.prepTime}
          onChange={(e) => set("prepTime", e.target.value)}
        />
        <FormField
          label="Ədviyyat səviyyəsi"
          as="select"
          value={values.spicyLevel}
          onChange={(e) => set("spicyLevel", e.target.value)}
          options={SPICY_OPTIONS}
        />
        <FormField
          label="Ölçülər (Ad:əlavə qiymət, ...)"
          placeholder="məs. Tək lavaş:0, Cift lavaş:1.5"
          className="sm:col-span-2"
          value={values.sizes}
          onChange={(e) => set("sizes", e.target.value)}
        />
        <FormField
          label="Əlavələr (Ad:qiymət, ...)"
          placeholder="məs. Əlavə pendir:1, Sous:0.5"
          className="sm:col-span-2"
          value={values.extras}
          onChange={(e) => set("extras", e.target.value)}
        />
        <div className="flex items-center gap-6 sm:col-span-2">
          <Toggle checked={values.bestseller} onChange={(v) => set("bestseller", v)} label="Bestseller" />
          <Toggle checked={values.active} onChange={(v) => set("active", v)} label="Aktiv" />
        </div>
      </form>
    </Modal>
  );
}
