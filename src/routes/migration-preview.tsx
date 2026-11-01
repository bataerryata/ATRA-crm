import { createFileRoute } from "@tanstack/react-router";

// The ATRA screen itself is rendered by the root layout from the URL; this file only gives the page its own address and title.
export const Route = createFileRoute("/migration-preview")({
  head: () => ({
    meta: [
      { title: "پیش‌نمایش تبدیل داده‌ها | آترا" },
      { name: "description", content: "گزارش فقط‌خواندنی تبدیل مبالغ و تاریخ‌های قدیمی به مقدار دقیق در آترا." },
      { property: "og:title", content: "پیش‌نمایش تبدیل داده‌ها | آترا" },
      { property: "og:description", content: "گزارش فقط‌خواندنی تبدیل مبالغ و تاریخ‌های قدیمی به مقدار دقیق در آترا." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
