import { useEffect, useState } from "react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import Toggle from "../ui/Toggle.jsx";
import { validate, required } from "../../utils/validators.js";

const EMPTY = { name: "", icon: "", active: true };

export default function CategoryFormModal({ isOpen, onClose, onSubmit, category }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(category ? { ...category } : EMPTY);
    setErrors({});
  }, [category, isOpen]);

  function set(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values, { name: [required] });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await onSubmit(values);
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
      title={category ? "Kateqoriyanı redaktə et" : "Yeni kateqoriya"}
      size="sm"
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          label="Ad"
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
        />
        <FormField
          label="İkon (emoji, könüllü)"
          value={values.icon}
          onChange={(e) => set("icon", e.target.value)}
        />
        <Toggle checked={values.active} onChange={(v) => set("active", v)} label="Aktiv" />
      </form>
    </Modal>
  );
}
