import Dropdown from "../ui/Dropdown.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TRANSITIONS } from "../../utils/constants.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function OrderStatusDropdown({ order, onChangeStatus }) {
  const { showToast } = useToast();
  const options = ORDER_STATUS_TRANSITIONS[order.status].map((status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
  }));

  async function handleChange(status) {
    if (status === order.status) return;
    try {
      await onChangeStatus(order.id, status);
      showToast(`${order.orderNumber} statusu "${ORDER_STATUS_LABELS[status]}" olaraq yeniləndi`);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <Dropdown
      value={order.status}
      options={options}
      onChange={handleChange}
      renderTrigger={() => (
        <span className="cursor-pointer">
          <StatusBadge status={order.status} />
        </span>
      )}
    />
  );
}
