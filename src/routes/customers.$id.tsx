import { createFileRoute } from "@tanstack/react-router";

// The ATRA screen itself is rendered by the root layout from the URL; this file only gives the page its own address and title.
export const Route = createFileRoute("/customers/$id")({
  head: () => ({
    meta: [
      { title: "پرونده مشتری | آترا" },
      { name: "description", content: "پرونده مشتری: اطلاعات تماس، سفارش‌ها و پیگیری‌ها در آترا." },
      { property: "og:title", content: "پرونده مشتری | آترا" },
      { property: "og:description", content: "پرونده مشتری: اطلاعات تماس، سفارش‌ها و پیگیری‌ها در آترا." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
