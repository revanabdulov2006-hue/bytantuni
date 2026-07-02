import Modal from "./Modal.jsx";
import Button from "./Button.jsx";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, entityName, isDeleting }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Silinməni təsdiqlə"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Silinir..." : "Sil"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-text-dim">
        <span className="font-medium text-text">{entityName}</span> silinəcək. Bu əməliyyat geri
        qaytarıla bilməz. Davam etmək istəyirsiniz?
      </p>
    </Modal>
  );
}
