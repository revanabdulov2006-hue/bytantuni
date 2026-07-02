import { useEffect } from "react";
import Modal from "../ui/Modal.jsx";
import { formatDateTime } from "../../utils/format.js";

export default function MessageDetailModal({ message, onClose, onMarkAsRead }) {
  useEffect(() => {
    if (message && !message.read) onMarkAsRead(message.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message?.id]);

  if (!message) return null;

  return (
    <Modal isOpen={!!message} onClose={onClose} title={message.subject} size="md">
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-text-dim">Ad</div>
            <div className="text-text">{message.name}</div>
          </div>
          <div>
            <div className="text-xs text-text-dim">Tarix</div>
            <div className="text-text">{formatDateTime(message.createdAt)}</div>
          </div>
          <div>
            <div className="text-xs text-text-dim">E-poçt</div>
            <div className="text-text">{message.email}</div>
          </div>
          <div>
            <div className="text-xs text-text-dim">Telefon</div>
            <div className="text-text">{message.phone}</div>
          </div>
        </div>
        <div className="rounded-lg border border-hair p-3 text-text-dim">{message.message}</div>
      </div>
    </Modal>
  );
}
