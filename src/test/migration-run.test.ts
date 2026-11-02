import { describe, expect, it } from "vitest";
import { demoCustomers, demoOrders, demoTasks, type BatteryOrder, type CrmTask } from "../components/atra/crm-data";
import { migrateOrders, migrateTasks, runDataMigration } from "../components/atra/migration-run";

describe("migrateOrders", () => {
  it("adds the exact Toman value next to the unchanged display text", () => {
    const { orders } = migrateOrders(demoOrders);
    const first = orders.find((o) => o.id === "سفارش ۲۴۸۱")!;
    expect(first.amount).toBe("۴۲۰ میلیون"); // display text untouched
    expect(first.amountValue).toBe(420_000_000);
  });

  it("adds the ISO delivery date next to the unchanged Shamsi text", () => {
    const { orders } = migrateOrders(demoOrders);
    const first = orders.find((o) => o.id === "سفارش ۲۴۸۱")!;
    expect(first.deliveryDate).toBe("۱۰ آبان ۱۴۰۳");
    expect(first.deliveryDateIso).toBe("2024-10-31");
  });

  it("converts every demo order and keeps the count identical", () => {
    const { orders, converted, skipped } = migrateOrders(demoOrders);
    expect(orders).toHaveLength(demoOrders.length);
    expect(converted).toBe(demoOrders.length);
    expect(skipped).toHaveLength(0);
  });

  it("leaves a Rial amount untouched and reports it", () => {
    const rial: BatteryOrder = { id: "سفارش تست", customerId: "cus-101", batteryModel: "X", quantity: 1, amount: "۵۰۰ میلیون ریال", deliveryDate: "۱۰ آبان ۱۴۰۳", status: "ثبت سفارش" };
    const { orders, skipped } = migrateOrders([rial]);
    expect(orders[0]!.amountValue).toBeUndefined();
    expect(orders[0]!.deliveryDateIso).toBe("2024-10-31"); // readable date still converts
    expect(skipped).toHaveLength(1);
    expect(skipped[0]!.id).toBe("سفارش تست");
  });

  it("leaves an unreadable date untouched and reports it", () => {
    const bad: BatteryOrder = { id: "سفارش تست", customerId: "cus-101", batteryModel: "X", quantity: 1, amount: "۱۰ میلیون", deliveryDate: "نامشخص", status: "ثبت سفارش" };
    const { orders, skipped } = migrateOrders([bad]);
    expect(orders[0]!.deliveryDateIso).toBeUndefined();
    expect(orders[0]!.amountValue).toBe(10_000_000);
    expect(skipped).toHaveLength(1);
  });

  it("never rewrites a record that already has exact values", () => {
    const exact: BatteryOrder = { id: "سفارش تست", customerId: "cus-101", batteryModel: "X", quantity: 1, amount: "۱۰ میلیون", amountValue: 10_000_000, deliveryDate: "۱۰ آبان ۱۴۰۳", deliveryDateIso: "2024-10-31", status: "ثبت سفارش" };
    const { orders, converted } = migrateOrders([exact]);
    expect(orders[0]).toBe(exact); // same object, untouched
    expect(converted).toBe(0);
  });
});

describe("migrateTasks", () => {
  it("links each demo task to its customer by unique name and adds the ISO date", () => {
    const { tasks, converted, skipped } = migrateTasks(demoTasks, demoCustomers);
    expect(tasks).toHaveLength(demoTasks.length);
    expect(converted).toBe(demoTasks.length);
    expect(skipped).toHaveLength(0);
    const first = tasks.find((t) => t.id === "task-1")!;
    expect(first.customer).toBe("صنایع آریا شرق"); // display name untouched
    expect(first.customerId).toBe("cus-101");
    expect(first.dateIso).toBe("2024-10-15"); // ۲۴ مهر ۱۴۰۳ = 2024-10-15
  });

  it("leaves a task with an unknown customer untouched and reports it", () => {
    const orphan: CrmTask = { id: "task-x", title: "تماس", customer: "مشتری ناشناس", date: "۲۴ مهر ۱۴۰۳", time: "۰۹:۰۰", group: "امروز", type: "تماس", completed: false };
    const { tasks, skipped } = migrateTasks([orphan], demoCustomers);
    expect(tasks[0]!.customerId).toBeUndefined();
    expect(tasks[0]!.dateIso).toBe("2024-10-15");
    expect(skipped).toHaveLength(1);
  });

  it("leaves a task untouched when two customers share the name", () => {
    const dup = { ...demoCustomers[0]!, id: "cus-999" };
    const { tasks, skipped } = migrateTasks([demoTasks[0]!], [...demoCustomers, dup]);
    expect(tasks[0]!.customerId).toBeUndefined();
    expect(skipped.some((s) => s.id === "task-1")).toBe(true);
  });
});

describe("runDataMigration", () => {
  it("keeps record counts identical before and after", () => {
    const { report } = runDataMigration(demoCustomers, demoOrders, demoTasks);
    expect(report.ordersAfter).toBe(report.ordersBefore);
    expect(report.tasksAfter).toBe(report.tasksBefore);
    expect(report.ordersConverted).toBe(demoOrders.length);
    expect(report.tasksConverted).toBe(demoTasks.length);
    expect(report.skipped).toHaveLength(0);
  });

  it("is idempotent: a second run converts nothing and changes nothing", () => {
    const first = runDataMigration(demoCustomers, demoOrders, demoTasks);
    const second = runDataMigration(demoCustomers, first.orders, first.tasks);
    expect(second.report.ordersConverted).toBe(0);
    expect(second.report.tasksConverted).toBe(0);
    expect(second.report.skipped).toHaveLength(0);
    expect(second.orders).toEqual(first.orders);
    expect(second.tasks).toEqual(first.tasks);
  });

  it("does not mutate its inputs", () => {
    const orders = structuredClone(demoOrders);
    const tasks = structuredClone(demoTasks);
    runDataMigration(demoCustomers, orders, tasks);
    expect(orders).toEqual(demoOrders);
    expect(tasks).toEqual(demoTasks);
  });
});
