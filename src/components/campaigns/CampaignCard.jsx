import { Pencil, Trash2 } from "lucide-react";
import Toggle from "../ui/Toggle.jsx";
import Badge from "../ui/Badge.jsx";
import { formatDate } from "../../utils/format.js";

export default function CampaignCard({ campaign, onEdit, onDelete, onToggleActive }) {
  const isExpired = new Date(campaign.endDate) < new Date();

  return (
    <div className={`overflow-hidden rounded-2xl border border-hair bg-surface ${isExpired ? "opacity-60" : ""}`}>
      <div className="flex h-32 items-center justify-center bg-surface-2">
        {campaign.bannerImage ? (
          <img src={campaign.bannerImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-3xl">🎉</span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text">{campaign.title}</h3>
          <Badge className="bg-accent/12 text-accent">{campaign.discountPercent}%</Badge>
        </div>
        <p className="text-sm text-text-dim">{campaign.description}</p>
        <div className="text-xs text-text-dim">
          {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
          {isExpired && <span className="ml-2 text-red-500">Bitib</span>}
        </div>
        <div className="flex items-center justify-between pt-2">
          <Toggle checked={campaign.active} onChange={onToggleActive} />
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="rounded-lg p-1.5 text-text-dim hover:bg-surface-2 hover:text-text"
              aria-label="Redaktə et"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg p-1.5 text-text-dim hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
              aria-label="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
