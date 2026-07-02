import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal.jsx";
import CampaignCard from "../../components/campaigns/CampaignCard.jsx";
import CampaignFormModal from "../../components/campaigns/CampaignFormModal.jsx";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function CampaignsPage() {
  const { campaigns, isLoading, error, addCampaign, editCampaign, removeCampaign } = useCampaigns();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(data) {
    try {
      if (editingCampaign) {
        await editCampaign(editingCampaign.id, data);
        showToast("Kampaniya yeniləndi");
      } else {
        await addCampaign(data);
        showToast("Kampaniya əlavə edildi");
      }
    } catch (err) {
      showToast(err.message, "error");
      throw err; // keeps the form modal open
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await removeCampaign(deletingCampaign.id);
      showToast("Kampaniya silindi");
      setDeletingCampaign(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  function handleToggleActive(id, active) {
    editCampaign(id, { active }).catch((err) => showToast(err.message, "error"));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-(--font-display) text-xl font-semibold text-text">Kampaniyalar</h2>
          <p className="text-sm text-text-dim">Endirim və promosyonları idarə edin</p>
        </div>
        <Button
          onClick={() => {
            setEditingCampaign(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> Yeni kampaniya
        </Button>
      </div>

      {error ? (
        <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton variant="card" count={3} />
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState icon="🎉" title="Hələ kampaniya yoxdur" description="İlk kampaniyanızı əlavə edin." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => {
                setEditingCampaign(campaign);
                setFormOpen(true);
              }}
              onDelete={() => setDeletingCampaign(campaign)}
              onToggleActive={(v) => handleToggleActive(campaign.id, v)}
            />
          ))}
        </div>
      )}

      <CampaignFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        campaign={editingCampaign}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingCampaign}
        onClose={() => setDeletingCampaign(null)}
        onConfirm={handleDelete}
        entityName={deletingCampaign?.title}
        isDeleting={deleting}
      />
    </div>
  );
}
