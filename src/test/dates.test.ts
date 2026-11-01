import { describe, expect, it } from "vitest";
import { formatJalaliDate, parseJalaliDate } from "@/components/atra/dates";

describe("parseJalaliDate", () => {
  it("parses «۱۰ آبان ۱۴۰۳» to 2024-10-31", () => {
    expect(parseJalaliDate("۱۰ آبان ۱۴۰۳")).toBe("2024-10-31");
  });

  it("accepts Latin digits", () => {
    expect(parseJalaliDate("10 آبان 1403")).toBe("2024-10-31");
  });

  it("rejects ۳۱ مهر because مهر has 30 days", () => {
    expect(parseJalaliDate("۳۱ مهر ۱۴۰۳")).toBeNull();
  });

  it("accepts ۳۰ اسفند only in a leap year", () => {
    expect(parseJalaliDate("۳۰ اسفند ۱۴۰۳")).not.toBeNull();
    expect(parseJalaliDate("۳۰ اسفند ۱۴۰۰")).toBeNull();
  });

  it("rejects unknown month names and malformed input", () => {
    expect(parseJalaliDate("۱۰ ابان ۱۴۰۳")).toBeNull();
    expect(parseJalaliDate("۱۴۰۳/۰۸/۱۰")).toBeNull();
    expect(parseJalaliDate("")).toBeNull();
    expect(parseJalaliDate(null)).toBeNull();
  });
});

describe("formatJalaliDate", () => {
  it("formats 2024-10-31 as «۱۰ آبان ۱۴۰۳»", () => {
    expect(formatJalaliDate("2024-10-31")).toBe("۱۰ آبان ۱۴۰۳");
  });

  it("round-trips with parseJalaliDate", () => {
    const iso = parseJalaliDate("۲۶ مهر ۱۴۰۳");
    expect(iso).not.toBeNull();
    expect(formatJalaliDate(iso!)).toBe("۲۶ مهر ۱۴۰۳");
  });

  it("rejects non-ISO input", () => {
    expect(formatJalaliDate("۱۰ آبان ۱۴۰۳")).toBeNull();
    expect(formatJalaliDate("2024-10-31 12:00")).toBeNull();
  });
});
