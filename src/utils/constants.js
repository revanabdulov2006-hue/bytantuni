export const ORDER_STATUS_LABELS = {
  new: "Yeni",
  preparing: "Hazırlanır",
  ready: "Hazırdır",
  delivered: "Çatdırıldı",
  cancelled: "Ləğv edildi",
};

export const ORDER_STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  preparing: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  ready: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export const ORDER_STATUS_TRANSITIONS = {
  new: ["new", "preparing", "cancelled"],
  preparing: ["preparing", "ready", "cancelled"],
  ready: ["ready", "delivered", "cancelled"],
  delivered: ["delivered"],
  cancelled: ["cancelled"],
};

export const BOOLEAN_STATUS_COLORS = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  inactive: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
  read: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
  unread: "bg-accent/15 text-accent",
};

export const CURRENCY = "₼";
