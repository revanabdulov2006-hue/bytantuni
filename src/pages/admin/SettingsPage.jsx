import { useEffect, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import FormField from "../../components/ui/FormField.jsx";
import ImageUpload from "../../components/ui/ImageUpload.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { useSettings } from "../../hooks/useSettings.js";
import { useToast } from "../../context/ToastContext.jsx";

function SettingsSection({ title, children, onSave, saving }) {
  return (
    <div className="rounded-2xl border border-hair bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <Button variant="secondary" onClick={onSave} disabled={saving}>
          {saving ? "Yadda saxlanılır..." : "Yadda saxla"}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, isLoading, error, updateSection } = useSettings();
  const { showToast } = useToast();

  const [general, setGeneral] = useState(null);
  const [social, setSocial] = useState(null);
  const [seo, setSeo] = useState(null);
  const [security, setSecurity] = useState(null);
  const [savingSection, setSavingSection] = useState(null);

  useEffect(() => {
    if (settings) {
      setGeneral(settings.general);
      setSocial(settings.social);
      setSeo(settings.seo);
      setSecurity(settings.security);
    }
  }, [settings]);

  async function handleSave(section, values) {
    setSavingSection(section);
    try {
      await updateSection(section, values);
      showToast("Ayarlar yadda saxlanıldı");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingSection(null);
    }
  }

  if (error) {
    return <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />;
  }

  if (isLoading || !general) {
    return (
      <div className="space-y-4">
        <Skeleton variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-(--font-display) text-xl font-semibold text-text">Sayt Ayarları</h2>
        <p className="text-sm text-text-dim">Restoran, sosial media və SEO məlumatlarını idarə edin</p>
      </div>

      <SettingsSection
        title="Ümumi"
        onSave={() => handleSave("general", general)}
        saving={savingSection === "general"}
      >
        <FormField
          label="Restoran adı"
          value={general.restaurantName}
          onChange={(e) => setGeneral({ ...general, restaurantName: e.target.value })}
        />
        <FormField
          label="Telefon"
          value={general.phone}
          onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
        />
        <FormField
          label="Ünvan"
          value={general.address}
          onChange={(e) => setGeneral({ ...general, address: e.target.value })}
        />
        <FormField
          label="İş saatları"
          value={general.workingHours}
          onChange={(e) => setGeneral({ ...general, workingHours: e.target.value })}
        />
        <FormField
          label="WhatsApp №1 (sifariş)"
          value={general.whatsapp1}
          onChange={(e) => setGeneral({ ...general, whatsapp1: e.target.value })}
        />
        <FormField
          label="WhatsApp №2 (ehtiyat)"
          value={general.whatsapp2}
          onChange={(e) => setGeneral({ ...general, whatsapp2: e.target.value })}
        />
        <div className="sm:col-span-2">
          <ImageUpload
            label="Loqo"
            value={general.logoUrl}
            onChange={(v) => setGeneral({ ...general, logoUrl: v })}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Sosial Media"
        onSave={() => handleSave("social", social)}
        saving={savingSection === "social"}
      >
        <FormField
          label="Facebook"
          value={social.facebook}
          onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
        />
        <FormField
          label="Instagram"
          value={social.instagram}
          onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
        />
        <FormField
          label="TikTok"
          value={social.tiktok}
          onChange={(e) => setSocial({ ...social, tiktok: e.target.value })}
        />
      </SettingsSection>

      <SettingsSection title="SEO" onSave={() => handleSave("seo", seo)} saving={savingSection === "seo"}>
        <FormField
          label="Sayt başlığı"
          value={seo.metaTitle}
          onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
        />
        <FormField
          className="sm:col-span-2"
          label="Meta təsvir"
          as="textarea"
          value={seo.metaDescription}
          onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
        />
        <div className="sm:col-span-2">
          <ImageUpload
            label="Favicon"
            value={seo.faviconUrl}
            onChange={(v) => setSeo({ ...seo, faviconUrl: v })}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Təhlükəsizlik"
        onSave={() => handleSave("security", security)}
        saving={savingSection === "security"}
      >
        <FormField
          label="Admin e-poçtu"
          value={security.adminEmail}
          onChange={(e) => setSecurity({ ...security, adminEmail: e.target.value })}
        />
        <FormField
          label="Giriş kodu"
          value={security.adminCode}
          onChange={(e) => setSecurity({ ...security, adminCode: e.target.value })}
        />
      </SettingsSection>
    </div>
  );
}
