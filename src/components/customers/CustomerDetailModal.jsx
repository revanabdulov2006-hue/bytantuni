import Modal from "../ui/Modal.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import { formatDate, formatDateTime, formatPrice } from "../../utils/format.js";

export default function CustomerDetailModal({ customer, orders, onClose }) {
  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.phone === customer.phone);

  return (
    <Modal isOpen={!!customer} onClose={onClose} title={customer.fullName} size="lg">
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-hair p-3">
          <div>
            <div className="text-xs text-text-dim">Telefon</div>
            <div className="text-text">{customer.phone}</div>
          </div>
          <div>
            <div className="text-xs text-text-dim">Son sifariş</div>
            <div className="text-text">{formatDate(customer.lastOrderDate)}</div>
          </div>
          <div>
            <div className="text-xs text-text-dim">Toplam sifariş</div>
            <div className="text-text">{customer.totalOrders}</div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-text">Sifariş tarixçəsi</div>
          <div className="divide-y divide-hair rounded-lg border border-hair">
            {customerOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-3 py-2">
                <div>
                  <div className="text-text">{order.orderNumber}</div>
                  <div className="text-xs text-text-dim">{formatDateTime(order.createdAt)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-dim">{formatPrice(order.total)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
