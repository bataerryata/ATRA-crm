import { createFileRoute } from "@tanstack/react-router";

// The ATRA screen itself is rendered by the root layout from the URL; this file only gives the page its own address and title.
export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "سفارش‌ها | آترا" },
      { name: "description", content: "سفارش‌های باتری و وضعیت هر سفارش در آترا." },
      { property: "og:title", content: "سفارش‌ها | آترا" },
      { property: "og:description", content: "سفارش‌های باتری و وضعیت هر سفارش در آترا." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
