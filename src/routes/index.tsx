import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "آترا | سامانه مدیریت ارتباط با مشتری" },
      {
        name: "description",
        content: "CRM فارسی آترا برای مدیریت مشتریان، سفارش‌های باتری، پیگیری‌ها و دستیار هوشمند.",
      },
      { property: "og:title", content: "آترا | سامانه مدیریت ارتباط با مشتری" },
      {
        property: "og:description",
        content: "CRM فارسی آترا برای مدیریت مشتریان، سفارش‌های باتری، پیگیری‌ها و دستیار هوشمند.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
