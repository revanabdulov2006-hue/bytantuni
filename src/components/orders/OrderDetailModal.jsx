import Modal from "../ui/Modal.jsx";
import OrderStatusDropdown from "./OrderStatusDropdown.jsx";
import { formatDateTime, formatPrice } from "../../utils/format.js";

export default function OrderDetailModal({ order, onClose, onChangeStatus }) {
  if (!order) return null;

  return (
    <Modal isOpen={!!order} onClose={onClose} title={`Sifariş ${order.orderNumber}`} size="md">
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-text">{order.customerName}</div>
            <div className="text-text-dim">{order.phone}</div>
          </div>
          <OrderStatusDropdown order={order} onChangeStatus={onChangeStatus} />
        </div>

        <div className="text-xs text-text-dim">{formatDateTime(order.createdAt)}</div>

        <div className="divide-y divide-hair rounded-lg border border-hair">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2">
              <div>
                <div className="text-text">{item.name}</div>
                {item.variant && <div className="text-xs text-text-dim">{item.variant}</div>}
              </div>
              <div className="text-text-dim">
                {item.qty} × {formatPrice(item.price)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-hair pt-3 text-base font-semibold text-text">
          <span>Cəmi</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </Modal>
  );
}
