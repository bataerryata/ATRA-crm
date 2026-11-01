import { describe, expect, it } from "vitest";
import { customerPath, pageFromPath, pagePaths } from "@/components/atra/atra-paths";

describe("ATRA screen ↔ URL", () => {
  it("maps each screen to its URL and back", () => {
    for (const [page, path] of Object.entries(pagePaths)) expect(pageFromPath(path).page).toBe(page);
  });
  it("opens a customer profile by id", () => {
    expect(pageFromPath(customerPath("cus-101"))).toEqual({ page: "پرونده مشتری", customerId: "cus-101" });
  });
  it("falls back to dashboard for unknown paths", () => {
    expect(pageFromPath("/nope").page).toBe("داشبورد");
  });
});
