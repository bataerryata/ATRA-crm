// Extracted verbatim from AtraApp.tsx; markup and classes unchanged.
import type { ReactNode } from "react";
import { useState, type FormEvent } from "react";
import {
  demoCustomers,
  orderStatuses,
  type BatteryOrder,
  type CrmTask,
  type Customer,
  type CustomerType,
  type OrderStatus,
} from "./crm-data";

export type Page = "داشبورد" | "مشتریان" | "پرونده مشتری" | "وظایف و تقویم" | "سفارش‌ها" | "دستیار هوشمند";

export type IconName =
  | "grid"
  | "users"
  | "user"
  | "check"
  | "chart"
  | "box"
  | "spark"
  | "settings"
  | "search"
  | "bell"
  | "plus"
  | "arrow"
  | "phone"
  | "calendar"
  | "clock"
  | "wallet"
  | "file"
  | "more"
  | "chevron"
  | "filter"
  | "message"
  | "mail"
  | "location"
  | "edit"
  | "target";

export const iconPaths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  check: <><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
  chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-8"/></>,
  box: <><path d="m21 8-9 5-9-5"/><path d="m3 8 9-5 9 5v8l-9 5-9-5Z"/><path d="M12 13v8"/></>,
  spark: <><path d="m12 3-1.8 4.2L6 9l4.2 1.8L12 15l1.8-4.2L18 9l-4.2-1.8Z"/><path d="m5 15-.9 2.1L2 18l2.1.9L5 21l.9-2.1L8 18l-2.1-.9Z"/><path d="m19 14-.9 2.1L16 17l2.1.9L19 20l.9-2.1L22 17l-2.1-.9Z"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.12.37.34.7.65.94.3.24.68.37 1.06.37H21v4h-.09c-.65 0-1.24.38-1.51.69Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  arrow: <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  wallet: <><path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"/><path d="M16 14h2"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  filter: <path d="M4 5h16M7 12h10M10 19h4"/>,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

export const navItems: { label: string; icon: IconName }[] = [
  { label: "داشبورد", icon: "grid" },
  { label: "مشتریان", icon: "users" },
  { label: "وظایف و تقویم", icon: "check" },
  { label: "مسیر فروش", icon: "chart" },
  { label: "سفارش‌ها", icon: "box" },
  { label: "دستیار هوشمند", icon: "spark" },
];

export const pageDetails: Record<Page, { title: string; subtitle: string }> = {
  "داشبورد": { title: "صبح بخیر، احسان", subtitle: "امروز ۸ پیگیری و ۳ تصمیم مهم در انتظار شماست." },
  "مشتریان": { title: "مشتریان", subtitle: "مدیریت اطلاعات و ارتباط با مشتریان آتا" },
  "پرونده مشتری": { title: "پرونده مشتری", subtitle: "نمای کامل ارتباطات، فروش و فعالیت‌های مشتری" },
  "وظایف و تقویم": { title: "وظایف و پیگیری‌ها", subtitle: "برنامه‌ریزی و کنترل فعالیت‌های تیم فروش" },
  "سفارش‌ها": { title: "سفارش‌های باتری", subtitle: "کنترل سفارش از ثبت اولیه تا تحویل به مشتری" },
  "دستیار هوشمند": { title: "دستیار هوشمند آتا", subtitle: "پیشنهادهای نمایشی برای برنامه‌ریزی و پیگیری بهتر" },
};

export function Header({ page, onQuickAdd }: { page: Page; onQuickAdd: () => void }) {
  const details = pageDetails[page];
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">سه‌شنبه، ۲۴ مهر ۱۴۰۳</p>
        <h1>{details.title}</h1>
        <p className="subtitle">{details.subtitle}</p>
      </div>
      <div className="header-actions">
        <label className="search-box">
          <Icon name="search" size={18} />
          <input aria-label="جست‌وجو" placeholder="جست‌وجوی مشتری، سفارش..." />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button" aria-label="اعلان‌ها"><Icon name="bell" size={20}/><span className="notification-dot"/></button>
        <button className="primary-button" onClick={onQuickAdd}><Icon name="plus" size={18}/> ثبت سریع</button>
      </div>
    </header>
  );
}

export function Sidebar({ page, setPage, openTasks }: { page: Page; setPage: (page: Page) => void; openTasks: number }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">آ</div>
        <div><strong>آتا</strong><span>سامانه مدیریت ارتباط</span></div>
      </div>
      <nav>
        <p className="nav-heading">فضای کاری</p>
        {navItems.map((item) => (
          <button key={item.label} onClick={() => item.label !== "مسیر فروش" && setPage(item.label as Page)} className={`nav-item ${page === item.label || (page === "پرونده مشتری" && item.label === "مشتریان") ? "active" : ""}`}>
            <Icon name={item.icon} size={20}/><span>{item.label}</span>
            {item.label === "وظایف و تقویم" && <b>{openTasks}</b>}
            {item.label === "دستیار هوشمند" && <i>جدید</i>}
          </button>
        ))}
        <div className="nav-separator"/>
        <button className="nav-item"><Icon name="settings" size={20}/><span>تنظیمات و دسترسی</span></button>
      </nav>
      <div className="assistant-card">
        <div className="assistant-icon"><Icon name="spark" size={20}/></div>
        <strong>دستیار آتا</strong>
        <p>برای امروز چه برنامه‌ای دارم؟</p>
        <button onClick={() => setPage("دستیار هوشمند")}>شروع گفت‌وگو <Icon name="arrow" size={15}/></button>
      </div>
      <div className="profile">
        <div className="avatar">اب</div>
        <div><strong>احسان باقری</strong><span>مدیر فروش</span></div>
        <Icon name="more" size={20}/>
      </div>
    </aside>
  );
}

export function EmptyTab({ tab }: { tab: string }) {
  return <section className="panel empty-tab"><div className="empty-icon"><Icon name="file" size={26}/></div><h2>{tab}</h2><p>اطلاعات این بخش در نسخه نمایشی به‌صورت خلاصه نمایش داده می‌شود.</p><button className="primary-button"><Icon name="plus" size={17}/> افزودن مورد جدید</button></section>;
}

export function Modal({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-head"><div><h2>{title}</h2><p>{description}</p></div><button className="modal-close" onClick={onClose} aria-label="بستن">×</button></div>
      {children}
    </section>
  </div>;
}


export function MobileNav({ page, setPage, onQuickAdd }: { page: Page; setPage: (page: Page) => void; onQuickAdd: () => void }) {
  return <nav className="mobile-nav">
    <button className={page === "داشبورد" ? "active" : ""} onClick={() => setPage("داشبورد")}><Icon name="grid" size={21}/><span>خانه</span></button>
    <button className={page === "مشتریان" || page === "پرونده مشتری" ? "active" : ""} onClick={() => setPage("مشتریان")}><Icon name="users" size={21}/><span>مشتریان</span></button>
    <button className={page === "سفارش‌ها" ? "active" : ""} onClick={() => setPage("سفارش‌ها")}><Icon name="box" size={21}/><span>سفارش‌ها</span></button>
    <button className="mobile-add" aria-label="ثبت سریع" onClick={onQuickAdd}><Icon name="plus" size={25}/></button>
    <button className={page === "وظایف و تقویم" ? "active" : ""} onClick={() => setPage("وظایف و تقویم")}><Icon name="check" size={21}/><span>وظایف</span></button>
    <button className={page === "دستیار هوشمند" ? "active" : ""} onClick={() => setPage("دستیار هوشمند")}><Icon name="spark" size={21}/><span>دستیار</span></button>
  </nav>;
}
