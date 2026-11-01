import { createFileRoute } from "@tanstack/react-router";

// The ATRA screen itself is rendered by the root layout from the URL; this file only gives the page its own address and title.
export const Route = createFileRoute("/customers/")({
  head: () => ({
    meta: [
      { title: "مشتریان | آترا" },
      { name: "description", content: "فهرست مشتریان، جستجو و افزودن مشتری جدید در آترا." },
      { property: "og:title", content: "مشتریان | آترا" },
      { property: "og:description", content: "فهرست مشتریان، جستجو و افزودن مشتری جدید در آترا." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
