import { describe, expect, it } from "vitest";
import { formatToman, parseTomanAmount } from "@/components/atra/money";

describe("parseTomanAmount", () => {
  it("reads «۴۲۰ میلیون» as 420,000,000 Toman", () => {
    expect(parseTomanAmount("۴۲۰ میلیون")).toBe(420_000_000);
  });

  it("reads Latin digits with the same unit words", () => {
    expect(parseTomanAmount("285 میلیون")).toBe(285_000_000);
  });

  it("reads «۱۲٫۴ میلیارد» as 12,400,000,000 Toman", () => {
    expect(parseTomanAmount("۱۲٫۴ میلیارد")).toBe(12_400_000_000);
  });

  it("reads a plain number as raw Toman", () => {
    expect(parseTomanAmount("۱٬۵۰۰٬۰۰۰")).toBe(1_500_000);
    expect(parseTomanAmount("1500000")).toBe(1_500_000);
  });

  it("rejects ریال so units are never mixed by guessing", () => {
    expect(parseTomanAmount("۴۲۰ میلیون ریال")).toBeNull();
  });

  it("rejects empty, non-numeric, zero and negative input", () => {
    expect(parseTomanAmount("")).toBeNull();
    expect(parseTomanAmount("نامشخص")).toBeNull();
    expect(parseTomanAmount("۰")).toBeNull();
    expect(parseTomanAmount(-5)).toBeNull();
    expect(parseTomanAmount(null)).toBeNull();
  });

  it("rejects fractional Toman", () => {
    expect(parseTomanAmount("۱٫۵")).toBeNull();
  });
});

describe("formatToman", () => {
  it("formats clean millions like the existing UI («۴۲۰ میلیون»)", () => {
    expect(formatToman(420_000_000)).toBe("۴۲۰ میلیون");
  });

  it("formats clean billions («۲ میلیارد»)", () => {
    expect(formatToman(2_000_000_000)).toBe("۲ میلیارد");
  });

  it("writes other amounts in full with Persian thousand separators", () => {
    expect(formatToman(1_500_000)).toBe("۱٬۵۰۰٬۰۰۰");
  });

  it("formats partial billions in the dashboard's «۱۲٫۴ میلیارد» style", () => {
    expect(formatToman(12_400_000_000)).toBe("۱۲٫۴ میلیارد");
    expect(formatToman(parseTomanAmount("۱۲٫۴ میلیارد")!)).toBe("۱۲٫۴ میلیارد");
  });

  it("round-trips clean values", () => {
    for (const text of ["۴۲۰ میلیون", "۲ میلیارد", "۱٬۵۰۰٬۰۰۰"]) {
      const value = parseTomanAmount(text);
      expect(value).not.toBeNull();
      expect(formatToman(value!)).toBe(text);
    }
  });
});
