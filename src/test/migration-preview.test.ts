import { describe, expect, it } from "vitest";
import { buildMigrationPreview, previewOrder, previewTask, summarize } from "@/components/atra/migration-preview";
import { demoCustomers, demoOrders, demoTasks, type BatteryOrder, type CrmTask } from "@/components/atra/crm-data";

describe("order amount preview", () => {
  it("proposes the exact Toman value for a «۴۲۰ میلیون» text amount", () => {
    const row = previewOrder(demoOrders[0]!);
    const amount = row.fields.find((f) => f.field === "مبلغ")!;
    expect(amount.status).toBe("ready");
    expect(amount.current).toBe("۴۲۰ میلیون تومان");
    expect(amount.proposed).toBe("۴۲۰٬۰۰۰٬۰۰۰ تومان");
  });

  it("leaves already-converted orders untouched", () => {
    const order: BatteryOrder = { ...demoOrders[0]!, amountValue: 420000000, deliveryDateIso: "2024-11-01" };
    const row = previewOrder(order);
    expect(row.status).toBe("converted");
    expect(row.fields.every((f) => f.status === "converted")).toBe(true);
  });

  it("flags a ریال amount as ambiguous instead of guessing", () => {
    const row = previewOrder({ ...demoOrders[0]!, amount: "۴۲۰ میلیون ریال" });
    const amount = row.fields.find((f) => f.field === "مبلغ")!;
    expect(amount.status).toBe("ambiguous");
    expect(amount.proposed).toBe("—");
    expect(amount.reason).toContain("ریال");
  });

  it("flags an unreadable date as ambiguous", () => {
    const row = previewOrder({ ...demoOrders[0]!, deliveryDate: "۳۱ مهر ۱۴۰۳" });
    const date = row.fields.find((f) => f.field === "تاریخ تحویل")!;
    expect(date.status).toBe("ambiguous");
  });

  it("proposes the ISO date for a readable Shamsi date", () => {
    const row = previewOrder(demoOrders[0]!); // ۱۰ آبان ۱۴۰۳
    const date = row.fields.find((f) => f.field === "تاریخ تحویل")!;
    expect(date.status).toBe("ready");
    expect(date.proposed).toBe("2024-10-31");
  });
});

describe("task preview", () => {
  it("links a task to its customer by exact name", () => {
    const row = previewTask(demoTasks[0]!, demoCustomers); // صنایع آریا شرق
    const link = row.fields.find((f) => f.field === "پیوند مشتری")!;
    expect(link.status).toBe("ready");
    expect(link.proposed).toContain("cus-101");
  });

  it("flags a task whose customer name matches nobody", () => {
    const row = previewTask({ ...demoTasks[0]!, customer: "مشتری ناشناس" }, demoCustomers);
    expect(row.status).toBe("ambiguous");
  });

  it("flags a task when two customers share the name", () => {
    const customers = [...demoCustomers, { ...demoCustomers[0]!, id: "cus-999" }];
    const row = previewTask(demoTasks[0]!, customers);
    const link = row.fields.find((f) => f.field === "پیوند مشتری")!;
    expect(link.status).toBe("ambiguous");
    expect(link.reason).toContain("بیش از یک");
  });

  it("leaves already-linked tasks untouched", () => {
    const task: CrmTask = { ...demoTasks[0]!, customerId: "cus-101", dateIso: "2024-10-16" };
    expect(previewTask(task, demoCustomers).status).toBe("converted");
  });
});

describe("summary", () => {
  it("keeps before and after counts equal — nothing is added or removed", () => {
    const { summary } = buildMigrationPreview(demoOrders, demoTasks, demoCustomers);
    expect(summary.before).toBe(demoOrders.length + demoTasks.length);
    expect(summary.after).toBe(summary.before);
    expect(summary.ready + summary.converted + summary.ambiguous).toBe(summary.before);
  });

  it("does not mutate the input records", () => {
    const orders = structuredClone(demoOrders);
    const tasks = structuredClone(demoTasks);
    buildMigrationPreview(orders, tasks, demoCustomers);
    expect(orders).toEqual(demoOrders);
    expect(tasks).toEqual(demoTasks);
  });

  it("counts an empty list cleanly", () => {
    expect(summarize([])).toEqual({ before: 0, after: 0, ready: 0, converted: 0, ambiguous: 0 });
  });
});
