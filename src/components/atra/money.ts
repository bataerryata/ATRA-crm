/**
 * Pure money helpers. Every amount in ATRA is Toman (تومان) — confirmed by the
 * owner. Display strings keep the existing «میلیون» / «میلیارد» style used
 * across the UI, so new records look exactly like the demo ones.
 * No React, no storage — safe to unit test and reuse later on a server.
 */

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

/** Converts Persian/Arabic digits in a string to Latin digits. */
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const p = persianDigits.indexOf(d);
    return String(p >= 0 ? p : arabicDigits.indexOf(d));
  });
}

/** Converts the digits of a number (or numeric string) to Persian digits. */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => persianDigits[Number(d)] ?? d);
}

/**
 * Parses a user-typed amount into an exact Toman integer.
 * Accepts Persian/Arabic/Latin digits, thousand separators (٬ , space),
 * and the words «میلیون» / «میلیارد» (with optional «تومان»).
 * Without a unit word the number is read as raw Toman.
 * Returns null for anything ambiguous — including «ریال», since mixing units
 * is a business decision that must never be guessed.
 */
export function parseTomanAmount(input: unknown): number | null {
  if (typeof input === "number") {
    return Number.isInteger(input) && input > 0 ? input : null;
  }
  if (typeof input !== "string") return null;
  const raw = toLatinDigits(input);
  if (raw.includes("ریال")) return null;
  const milliard = raw.includes("میلیارد");
  const million = !milliard && raw.includes("میلیون");
  const numericPart = raw
    .replace(/میلیارد|میلیون|تومان/g, "")
    .replace(/[٬,\s]/g, "")
    .replace("٫", ".");
  if (!/^\d+(\.\d+)?$/.test(numericPart)) return null;
  const value = Number(numericPart);
  const toman = milliard ? value * 1e9 : million ? value * 1e6 : value;
  if (!Number.isFinite(toman) || toman <= 0 || !Number.isInteger(toman)) return null;
  return toman;
}

/**
 * Formats an exact Toman integer for display, in the same style as the rest of
 * the UI: clean millions/billions become «۴۲۰ میلیون» / «۲ میلیارد», anything
 * else is written in full with Persian thousand separators.
 * The unit «تومان» is added by the page, as it already does today.
 */
export function formatToman(amount: number): string {
  if (!Number.isInteger(amount) || amount <= 0) return "";
  if (amount % 1e9 === 0) return `${toPersianDigits(amount / 1e9)} میلیارد`;
  if (amount >= 1e9 && amount % 1e6 === 0) return `${toPersianDigits(String(amount / 1e9).replace(".", "٫"))} میلیارد`;
  if (amount % 1e6 === 0) return `${toPersianDigits(amount / 1e6)} میلیون`;
  const grouped = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  return toPersianDigits(grouped);
}
