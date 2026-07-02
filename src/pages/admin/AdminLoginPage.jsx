import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import FormField from "../../components/ui/FormField.jsx";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const ok = await login(email, code);
      if (ok) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("E-poçt və ya kod yanlışdır.");
        showToast("E-poçt və ya kod yanlışdır", "error");
      }
    } catch {
      setError("Serverlə əlaqə qurulmadı. Yenidən cəhd edin.");
      showToast("Serverlə əlaqə qurulmadı", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-hair bg-surface p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
            <ShieldCheck size={22} />
          </div>
          <h1 className="font-(--font-display) text-lg font-semibold text-text">İdarəetmə Paneli</h1>
          <p className="mt-1 text-sm text-text-dim">Davam etmək üçün daxil olun</p>
        </div>

        <div className="flex flex-col gap-4">
          <FormField
            label="E-poçt"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="Giriş kodu"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={error || undefined}
          />
        </div>

        <Button type="submit" variant="primary" disabled={submitting} className="mt-5 w-full">
          {submitting ? "Yoxlanılır..." : "Daxil ol"}
        </Button>
      </form>
    </div>
  );
}
