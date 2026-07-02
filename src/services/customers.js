import { supabase } from "../lib/supabase.js";

// Read-only: rows come from the customer_stats view, which derives
// totalOrders/lastOrderDate from non-cancelled orders. Customer records are
// created by orders.createOrder (phone upsert at checkout).
function fromRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    totalOrders: Number(row.total_orders) || 0,
    lastOrderDate: row.last_order_date,
  };
}

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customer_stats")
    .select("*")
    .order("last_order_date", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data.map(fromRow);
}
