/**
 * Pure order-status workflow. No React, no storage — safe to unit test and to
 * reuse later on a server. See docs/ATRA-AUDIT.md §10 for the rule table and
 * the open questions that still need a business decision.
 */
import { orderStatuses, type BatteryOrder, type OrderStatus } from "./crm-data";

export type StatusChange = { from: OrderStatus; to: OrderStatus; at: string };

/**
 * Allowed next statuses. Main path follows the documented stage order:
 * ثبت سفارش → تأیید قیمت → مونتاژ → کنترل کیفیت → آماده تحویل → تحویل‌شده
 * Side paths: انتظار قطعه (pause during assembly, resume to assembly),
 * تحویل جزئی (part shipped from ready-for-delivery, rest delivered later).
 * Terminal: تحویل‌شده, لغوشده. Cancellation keeps the order and its history.
 */
export const allowedTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  "ثبت سفارش": ["تأیید قیمت", "لغوشده"],
  "تأیید قیمت": ["مونتاژ", "لغوشده"],
  "مونتاژ": ["کنترل کیفیت", "انتظار قطعه", "لغوشده"],
  "انتظار قطعه": ["مونتاژ", "لغوشده"],
  // QC → مونتاژ = rework after a failed check (flagged as an assumption in the audit).
  "کنترل کیفیت": ["آماده تحویل", "مونتاژ", "لغوشده"],
  "آماده تحویل": ["تحویل‌شده", "تحویل جزئی", "لغوشده"],
  // Cancelling after part of the goods shipped is an open question → blocked for now.
  "تحویل جزئی": ["آماده تحویل", "تحویل‌شده"],
  "تحویل‌شده": [],
  "لغوشده": [],
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (orderStatuses as readonly string[]).includes(value);
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export type TransitionResult =
  | { ok: true; order: BatteryOrder }
  | { ok: false; order: BatteryOrder; reason: string };

/** Returns a new order with the status changed and the change appended to history. Never mutates. */
export function transitionOrder(order: BatteryOrder, to: OrderStatus, at: Date = new Date()): TransitionResult {
  if (!isOrderStatus(to)) return { ok: false, order, reason: "وضعیت نامعتبر است." };
  if (order.status === to) return { ok: false, order, reason: "وضعیت تغییری نکرده است." };
  if (!canTransition(order.status, to)) {
    return { ok: false, order, reason: `انتقال از «${order.status}» به «${to}» مجاز نیست.` };
  }
  const change: StatusChange = { from: order.status, to, at: at.toISOString() };
  return { ok: true, order: { ...order, status: to, history: [...(order.history ?? []), change] } };
}

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const toLatin = (s: string) => s.replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)));
const toPersian = (n: number) => String(n).replace(/\d/g, (d) => persianDigits[Number(d)] ?? d);

/** Next sequential order id ("سفارش ۲۴۸۲"), unique among existing orders (replaces Date.now() slicing). */
export function nextOrderId(orders: Pick<BatteryOrder, "id">[]): string {
  const max = orders.reduce((m, o) => {
    const n = Number.parseInt(toLatin(o.id).replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `سفارش ${toPersian(max + 1)}`;
}

/** Quantity must be a positive whole number. */
export function parseQuantity(value: unknown): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : null;
}
