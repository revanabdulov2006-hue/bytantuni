import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <EmptyState
      icon="🔍"
      title="Səhifə tapılmadı"
      description="Axtardığınız səhifə mövcud deyil."
      action={
        <Link to="/admin/dashboard">
          <Button variant="secondary">İdarə Panelinə qayıt</Button>
        </Link>
      }
    />
  );
}
