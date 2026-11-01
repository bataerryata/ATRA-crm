/**
 * Pure Jalali (Shamsi) date helpers built on jalaali-js.
 * The reliable underlying value is an ISO calendar date ("2024-10-31"); the
 * Shamsi text ("۱۰ آبان ۱۴۰۳") is only the display, exactly like today.
 * No React, no storage — safe to unit test and reuse later on a server.
 */
import { isValidJalaaliDate, toGregorian, toJalaali } from "jalaali-js";
import { toLatinDigits, toPersianDigits } from "./money";

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
] as const;

/**
 * Parses a Shamsi date such as «۱۰ آبان ۱۴۰۳» (Persian or Latin digits, the
 * month written as a name) into an ISO date string. Returns null for anything
 * that is not a real Jalali date (wrong month name, 31 مهر, 30 اسفند in a
 * non-leap year, ...).
 */
export function parseJalaliDate(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const parts = toLatinDigits(input).trim().split(/\s+/).filter(Boolean);
  if (parts.length !== 3) return null;
  const [dayText, monthText, yearText] = parts as [string, string, string];
  const day = Number(dayText);
  const year = Number(yearText);
  const month = (JALALI_MONTHS as readonly string[]).indexOf(monthText) + 1;
  if (!Number.isInteger(day) || !Number.isInteger(year) || month < 1) return null;
  if (year < 1300 || year > 1500) return null;
  if (!isValidJalaaliDate(year, month, day)) return null;
  const { gy, gm, gd } = toGregorian(year, month, day);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
}

/**
 * Formats an ISO date string ("2024-10-31") as Shamsi display text
 * («۱۰ آبان ۱۴۰۳»). Returns null when the input is not an ISO date.
 */
export function formatJalaliDate(iso: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const [, gy, gm, gd] = match;
  const { jy, jm, jd } = toJalaali(Number(gy), Number(gm), Number(gd));
  return `${toPersianDigits(jd)} ${JALALI_MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
}
