import type { Page } from "./shared";

/** One URL per ATRA screen. Pure so it can be unit tested. */
export const pagePaths: Record<Exclude<Page, "پرونده مشتری">, string> = {
  "داشبورد": "/",
  "مشتریان": "/customers",
  "سفارش‌ها": "/orders",
  "وظایف و تقویم": "/tasks",
  "دستیار هوشمند": "/assistant",
};

export function customerPath(id: string) {
  return `/customers/${encodeURIComponent(id)}`;
}

/** Which screen a URL shows, plus the customer id for a profile URL. */
export function pageFromPath(pathname: string): { page: Page; customerId?: string } {
  const path = pathname.replace(/\/+$/, "") || "/";
  const profile = /^\/customers\/([^/]+)$/.exec(path);
  if (profile) return { page: "پرونده مشتری", customerId: decodeURIComponent(profile[1]!) };
  const entry = Object.entries(pagePaths).find(([, p]) => p === path);
  return { page: (entry?.[0] as Page | undefined) ?? "داشبورد" };
}
