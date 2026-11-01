import { describe, expect, it } from "vitest";

import { demoOrders, orderStatuses, type BatteryOrder } from "@/components/atra/crm-data";
import {
  allowedTransitions,
  canTransition,
  nextOrderId,
  parseQuantity,
  transitionOrder,
} from "@/components/atra/order-workflow";

const order = (status: BatteryOrder["status"]): BatteryOrder => ({
  id: "سفارش ۱", customerId: "cus-101", batteryModel: "L-24", quantity: 1, amount: "۱", deliveryDate: "-", status,
});

describe("order status transitions", () => {
  it("allows the documented main path step by step", () => {
    const path = ["ثبت سفارش", "تأیید قیمت", "مونتاژ", "کنترل کیفیت", "آماده تحویل", "تحویل‌شده"] as const;
    path.slice(1).forEach((to, i) => expect(canTransition(path[i]!, to)).toBe(true));
  });
  it("blocks skipping stages", () => {
    expect(canTransition("ثبت سفارش", "مونتاژ")).toBe(false);
    expect(canTransition("ثبت سفارش", "تحویل‌شده")).toBe(false);
    expect(canTransition("تأیید قیمت", "آماده تحویل")).toBe(false);
  });
  it("waiting for parts pauses assembly and resumes to assembly only", () => {
    expect(canTransition("مونتاژ", "انتظار قطعه")).toBe(true);
    expect(canTransition("انتظار قطعه", "مونتاژ")).toBe(true);
    expect(canTransition("انتظار قطعه", "آماده تحویل")).toBe(false);
  });
  it("partial delivery comes from ready-for-delivery and ends delivered", () => {
    expect(canTransition("آماده تحویل", "تحویل جزئی")).toBe(true);
    expect(canTransition("تحویل جزئی", "تحویل‌شده")).toBe(true);
    expect(canTransition("مونتاژ", "تحویل جزئی")).toBe(false);
  });
  it("delivered and cancelled are terminal", () => {
    expect(allowedTransitions["تحویل‌شده"]).toEqual([]);
    expect(allowedTransitions["لغوشده"]).toEqual([]);
  });
  it("every status has a rule entry", () => {
    for (const s of orderStatuses) expect(allowedTransitions[s]).toBeDefined();
  });
  it("unknown saved status never allows a move", () => {
    expect(canTransition("قدیمی" as never, "مونتاژ")).toBe(false);
  });
});

describe("transitionOrder", () => {
  it("records history and does not mutate the original", () => {
    const o = order("ثبت سفارش");
    const r = transitionOrder(o, "تأیید قیمت", new Date("2026-10-19T10:00:00Z"));
    expect(r.ok).toBe(true);
    expect(r.order.status).toBe("تأیید قیمت");
    expect(r.order.history).toEqual([{ from: "ثبت سفارش", to: "تأیید قیمت", at: "2026-10-19T10:00:00.000Z" }]);
    expect(o.status).toBe("ثبت سفارش");
    expect(o.history).toBeUndefined();
  });
  it("rejects an invalid jump and leaves the order unchanged", () => {
    const o = order("ثبت سفارش");
    const r = transitionOrder(o, "تحویل‌شده");
    expect(r.ok).toBe(false);
    expect(r.order).toBe(o);
  });
  it("cancellation keeps the order and its history", () => {
    const step = transitionOrder(order("ثبت سفارش"), "تأیید قیمت").order;
    const r = transitionOrder(step, "لغوشده");
    expect(r.ok).toBe(true);
    expect(r.order.id).toBe("سفارش ۱");
    expect(r.order.history?.map((h) => h.to)).toEqual(["تأیید قیمت", "لغوشده"]);
  });
});

describe("order creation helpers", () => {
  it("next id is one above the highest existing number", () => {
    expect(nextOrderId(demoOrders)).toBe("سفارش ۲۴۸۲");
    expect(nextOrderId([])).toBe("سفارش ۱");
  });
  it("next id never collides with existing ids", () => {
    const ids = new Set(demoOrders.map((o) => o.id));
    expect(ids.has(nextOrderId(demoOrders))).toBe(false);
  });
  it("quantity must be a positive whole number", () => {
    expect(parseQuantity("24")).toBe(24);
    expect(parseQuantity("0")).toBeNull();
    expect(parseQuantity("-3")).toBeNull();
    expect(parseQuantity("1.5")).toBeNull();
    expect(parseQuantity("abc")).toBeNull();
  });
});
