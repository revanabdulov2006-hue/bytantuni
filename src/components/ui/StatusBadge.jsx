import Badge from "./Badge.jsx";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, BOOLEAN_STATUS_COLORS } from "../../utils/constants.js";

export default function StatusBadge({ status }) {
  if (status in ORDER_STATUS_LABELS) {
    return <Badge className={ORDER_STATUS_COLORS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
  }

  const map = {
    active: "Aktiv",
    inactive: "Deaktiv",
    read: "Oxunub",
    unread: "Oxunmayıb",
  };

  const label = map[status] || status;
  return <Badge className={BOOLEAN_STATUS_COLORS[status]}>{label}</Badge>;
}
