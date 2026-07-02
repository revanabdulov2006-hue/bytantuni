import { createPortal } from "react-dom";
import { useToast } from "../../context/ToastContext.jsx";
import Toast from "./Toast.jsx";

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => dismissToast(t.id)} />
      ))}
    </div>,
    document.body
  );
}
