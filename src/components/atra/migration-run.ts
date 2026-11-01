/**
 * Approved data conversion (docs/MIGRATION-PLAN.md): adds the exact Toman
 * amount (amountValue), the ISO date (deliveryDateIso / dateIso) and the
 * customer link (customerId) to legacy orders/tasks, next to the unchanged
 * Persian display text. Pure module — no React, no storage.
 *
 * Safety rules (from the approved plan):
 * - Records that already have exact values are returned untouched.
 * - Anything unreadable (ریال amounts, unknown dates, unknown/duplicate
 *   customer names) is left exactly as it is and reported — nothing is guessed.
 * - Running it twice changes nothing (idempotent).
 * - Record counts never change: nothing is added or removed.
 */
import type { BatteryOrder, CrmTask, Customer } from "./crm-data";
import { parseTomanAmount } from "./money";
import { parseJalaliDate } from "./dates";

export type SkippedRecord = {
  id: string;
  kind: "order" | "task";
  /** Plain-Persian reason the record was left untouched. */
  reason: string;
};

export type MigrationReport = {
  ordersBefore: number;
  ordersAfter: number;
  tasksBefore: number;
  tasksAfter: number;
  /** Records that gained at least one exact field in this run. */
  ordersConverted: number;
  tasksConverted: number;
  skipped: SkippedRecord[];
};

export type MigrationResult = {
  orders: BatteryOrder[];
  tasks: CrmTask[];
  report: MigrationReport;
};

/** Adds amountValue / deliveryDateIso where readable; never removes or rewrites existing fields. */
export function migrateOrders(orders: BatteryOrder[]): { orders: BatteryOrder[]; converted: number; skipped: SkippedRecord[] } {
  let converted = 0;
  const skipped: SkippedRecord[] = [];
  const migrated = orders.map((order) => {
    let next = order;
    let changed = false;
    if (order.amountValue === undefined) {
      const parsed = parseTomanAmount(order.amount);
      if (parsed !== null) {
        next = { ...next, amountValue: parsed };
        changed = true;
      } else {
        skipped.push({ id: order.id, kind: "order", reason: `مبلغ «${order.amount}» به عدد تومان خوانا نیست.` });
      }
    }
    if (order.deliveryDateIso === undefined) {
      const parsed = parseJalaliDate(order.deliveryDate);
      if (parsed !== null) {
        next = { ...next, deliveryDateIso: parsed };
        changed = true;
      } else {
        skipped.push({ id: order.id, kind: "order", reason: `تاریخ «${order.deliveryDate}» خوانا نیست.` });
      }
    }
    if (changed) converted += 1;
    return next;
  });
  return { orders: migrated, converted, skipped };
}

/** Adds customerId (unique name match only) and dateIso where readable. */
export function migrateTasks(tasks: CrmTask[], customers: Customer[]): { tasks: CrmTask[]; converted: number; skipped: SkippedRecord[] } {
  let converted = 0;
  const skipped: SkippedRecord[] = [];
  const migrated = tasks.map((task) => {
    let next = task;
    let changed = false;
    if (task.customerId === undefined) {
      const matches = customers.filter((customer) => customer.name === task.customer);
      if (matches.length === 1) {
        next = { ...next, customerId: matches[0]!.id };
        changed = true;
      } else {
        skipped.push({
          id: task.id,
          kind: "task",
          reason: matches.length === 0
            ? `مشتری‌ای با نام «${task.customer}» پیدا نشد.`
            : `بیش از یک مشتری با نام «${task.customer}» وجود دارد.`,
        });
      }
    }
    if (task.dateIso === undefined) {
      const parsed = parseJalaliDate(task.date);
      if (parsed !== null) {
        next = { ...next, dateIso: parsed };
        changed = true;
      } else {
        skipped.push({ id: task.id, kind: "task", reason: `تاریخ «${task.date}» خوانا نیست.` });
      }
    }
    if (changed) converted += 1;
    return next;
  });
  return { tasks: migrated, converted, skipped };
}

/** Full conversion over the whole dataset. Customers need no conversion. */
export function runDataMigration(customers: Customer[], orders: BatteryOrder[], tasks: CrmTask[]): MigrationResult {
  const orderResult = migrateOrders(orders);
  const taskResult = migrateTasks(tasks, customers);
  return {
    orders: orderResult.orders,
    tasks: taskResult.tasks,
    report: {
      ordersBefore: orders.length,
      ordersAfter: orderResult.orders.length,
      tasksBefore: tasks.length,
      tasksAfter: taskResult.tasks.length,
      ordersConverted: orderResult.converted,
      tasksConverted: taskResult.converted,
      skipped: [...orderResult.skipped, ...taskResult.skipped],
    },
  };
}
