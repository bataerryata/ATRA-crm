/**
 * Pure read-only migration preview (Stage 2 follow-up).
 * For every legacy order/task it computes what the approved conversion WOULD
 * write — exact Toman amount, ISO date, customer id — next to the current
 * text value, and flags records that need a human decision.
 * It never mutates its inputs and never touches storage. The actual
 * conversion runs only after the owner approves docs/MIGRATION-PLAN.md.
 */
import type { BatteryOrder, CrmTask, Customer } from "./crm-data";
import { parseTomanAmount, toPersianDigits } from "./money";
import { parseJalaliDate } from "./dates";

/** ready = will be converted; converted = already exact, stays untouched; ambiguous = needs a human decision. */
export type FieldStatus = "ready" | "converted" | "ambiguous";

export type FieldPreview = {
  /** Persian label of the field, e.g. «مبلغ». */
  field: string;
  /** What the record shows today. */
  current: string;
  /** What the conversion would store (or «—» when undecidable). */
  proposed: string;
  status: FieldStatus;
  /** Why the field is ambiguous, in plain Persian. */
  reason?: string;
};

export type RecordPreview = {
  id: string;
  kind: "order" | "task";
  fields: FieldPreview[];
  status: FieldStatus;
};

export type PreviewSummary = {
  /** Records before the conversion. */
  before: number;
  /** Records after the conversion — always equal to before; nothing is added or removed. */
  after: number;
  ready: number;
  converted: number;
  ambiguous: number;
};

/** Exact Toman with Persian digits and thousand separators, e.g. «۴۲۰٬۰۰۰٬۰۰۰ تومان». */
function exactToman(amount: number): string {
  return `${toPersianDigits(String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, "٬"))} تومان`;
}

function orderAmountField(order: BatteryOrder): FieldPreview {
  const current = `${order.amount} تومان`;
  if (order.amountValue !== undefined) {
    return { field: "مبلغ", current, proposed: exactToman(order.amountValue), status: "converted" };
  }
  const parsed = parseTomanAmount(order.amount);
  if (parsed !== null) {
    return { field: "مبلغ", current, proposed: exactToman(parsed), status: "ready" };
  }
  const reason = order.amount.includes("ریال")
    ? "واحد این مبلغ ریال است؛ تبدیل ریال به تومان تصمیم جداگانه می‌خواهد."
    : "این مبلغ به‌صورت عدد تومان خوانا نیست.";
  return { field: "مبلغ", current, proposed: "—", status: "ambiguous", reason };
}

function dateField(label: string, display: string, iso: string | undefined): FieldPreview {
  if (iso !== undefined) {
    return { field: label, current: display, proposed: iso, status: "converted" };
  }
  const parsed = parseJalaliDate(display);
  if (parsed !== null) {
    return { field: label, current: display, proposed: parsed, status: "ready" };
  }
  return { field: label, current: display, proposed: "—", status: "ambiguous", reason: "این تاریخ شمسی خوانا نیست." };
}

function taskCustomerField(task: CrmTask, customers: Customer[]): FieldPreview {
  if (task.customerId !== undefined) {
    const name = customers.find((customer) => customer.id === task.customerId)?.name ?? task.customer;
    return { field: "پیوند مشتری", current: task.customer, proposed: `${name} (${task.customerId})`, status: "converted" };
  }
  const matches = customers.filter((customer) => customer.name === task.customer);
  if (matches.length === 1) {
    return { field: "پیوند مشتری", current: task.customer, proposed: `${matches[0]!.name} (${matches[0]!.id})`, status: "ready" };
  }
  const reason = matches.length === 0
    ? "مشتری‌ای با این نام در پرونده‌ها پیدا نشد."
    : "بیش از یک مشتری با این نام وجود دارد.";
  return { field: "پیوند مشتری", current: task.customer, proposed: "—", status: "ambiguous", reason };
}

function recordStatus(fields: FieldPreview[]): FieldStatus {
  if (fields.some((field) => field.status === "ambiguous")) return "ambiguous";
  if (fields.some((field) => field.status === "ready")) return "ready";
  return "converted";
}

export function previewOrder(order: BatteryOrder): RecordPreview {
  const fields = [orderAmountField(order), dateField("تاریخ تحویل", order.deliveryDate, order.deliveryDateIso)];
  return { id: order.id, kind: "order", fields, status: recordStatus(fields) };
}

export function previewTask(task: CrmTask, customers: Customer[]): RecordPreview {
  const fields = [taskCustomerField(task, customers), dateField("تاریخ", task.date, task.dateIso)];
  return { id: task.id, kind: "task", fields, status: recordStatus(fields) };
}

export function summarize(records: RecordPreview[]): PreviewSummary {
  return {
    before: records.length,
    after: records.length,
    ready: records.filter((record) => record.status === "ready").length,
    converted: records.filter((record) => record.status === "converted").length,
    ambiguous: records.filter((record) => record.status === "ambiguous").length,
  };
}

export function buildMigrationPreview(orders: BatteryOrder[], tasks: CrmTask[], customers: Customer[]) {
  const orderRows = orders.map(previewOrder);
  const taskRows = tasks.map((task) => previewTask(task, customers));
  return { orders: orderRows, tasks: taskRows, summary: summarize([...orderRows, ...taskRows]) };
}
