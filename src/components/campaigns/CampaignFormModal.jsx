import { useEffect, useState } from "react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import ImageUpload from "../ui/ImageUpload.jsx";
import Toggle from "../ui/Toggle.jsx";
import { validate, required } from "../../utils/validators.js";

const EMPTY = {
  title: "",
  description: "",
  bannerImage: "",
  discountPercent: "",
  startDate: "",
  endDate: "",
  active: true,
};

export default function CampaignFormModal({ isOpen, onClose, onSubmit, campaign }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(campaign ? { ...campaign } : EMPTY);
    setErrors({});
  }, [campaign, isOpen]);

  function set(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values, {
      title: [required],
      startDate: [required],
      endDate: [required],
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await onSubmit({ ...values, discountPercent: Number(values.discountPercent) || 0 });
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
      title={campaign ? "Kampaniyanı redaktə et" : "Yeni kampaniya"}
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
        <ImageUpload label="Banner şəkli" value={values.bannerImage} onChange={(v) => set("bannerImage", v)} />
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="Başlıq"
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            error={errors.title}
          />
          <FormField
            label="Endirim (%)"
            type="number"
            value={values.discountPercent}
            onChange={(e) => set("discountPercent", e.target.value)}
          />
        </div>
        <FormField
          label="Başlanğıc tarixi"
          type="date"
          required
          value={values.startDate}
          onChange={(e) => set("startDate", e.target.value)}
          error={errors.startDate}
        />
        <FormField
          label="Bitmə tarixi"
          type="date"
          required
          value={values.endDate}
          onChange={(e) => set("endDate", e.target.value)}
          error={errors.endDate}
        />
        <FormField
          className="sm:col-span-2"
          label="Təsvir"
          as="textarea"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <Toggle checked={values.active} onChange={(v) => set("active", v)} label="Aktiv" />
      </form>
    </Modal>
  );
}
