import { createFileRoute } from "@tanstack/react-router";

// The ATRA screen itself is rendered by the root layout from the URL; this file only gives the page its own address and title.
export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "دستیار هوشمند | آترا" },
      { name: "description", content: "دستیار هوشمند آترا (نسخه نمایشی)." },
      { property: "og:title", content: "دستیار هوشمند | آترا" },
      { property: "og:description", content: "دستیار هوشمند آترا (نسخه نمایشی)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
