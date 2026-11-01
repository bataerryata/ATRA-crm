import { createFileRoute } from "@tanstack/react-router";

// The ATRA screen itself is rendered by the root layout from the URL; this file only gives the page its own address and title.
export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "وظایف و تقویم | آترا" },
      { name: "description", content: "وظایف، تماس‌ها و جلسه‌های پیگیری در آترا." },
      { property: "og:title", content: "وظایف و تقویم | آترا" },
      { property: "og:description", content: "وظایف، تماس‌ها و جلسه‌های پیگیری در آترا." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
