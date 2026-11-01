// Extracted verbatim from AtraApp.tsx; markup and classes unchanged.
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
import { Icon, Header, Modal, EmptyTab, type IconName, type Page } from "./shared";

export function CustomerProfile({ customer, onBack, onEdit, orders }: { customer: Customer; onBack: () => void; onEdit: () => void; orders: BatteryOrder[] }) {
  const [tab, setTab] = useState("نمای کلی");
  return (
    <>
      <Header page="پرونده مشتری" onQuickAdd={onEdit}/>
      <main className="content customer-page">
        <button className="back-link" onClick={onBack}><Icon name="chevron" size={17}/> بازگشت به فهرست مشتریان</button>
        <section className="profile-hero">
          <div className="company-avatar">{customer.name.slice(0, 1)}</div>
          <div className="company-main"><div className="company-title"><h2>{customer.name}</h2><span className={`status ${customer.status === "فعال" ? "success" : "danger"}`}>{customer.status === "فعال" ? "مشتری فعال" : "نیازمند پیگیری"}</span><span className="priority">{customer.type}</span></div><p>{customer.industry}</p><div className="company-meta"><span><Icon name="location" size={16}/>{customer.location}</span><span><Icon name="calendar" size={16}/> مشتری نمونه CRM آتا</span><span><Icon name="user" size={16}/> مسئول: {customer.owner}</span></div></div>
          <div className="profile-actions"><button className="outline-button" onClick={onEdit}><Icon name="edit" size={17}/> ویرایش</button><button className="primary-button"><Icon name="plus" size={17}/> ثبت تعامل</button><button className="icon-button"><Icon name="more" size={20}/></button></div>
        </section>
        <div className="profile-tabs">
          {["نمای کلی","تعاملات","فرصت‌های فروش","پیش‌فاکتورها","سفارش‌ها","وظایف","امور مالی"].map(item => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}{item === "وظایف" && <b>۳</b>}</button>)}
        </div>
        {tab !== "نمای کلی" ? <EmptyTab tab={tab}/> : <div className="profile-layout">
          <div className="profile-primary">
            <section className="panel profile-kpis">
              <div><span>کل فروش</span><strong>۱٫۸۴ میلیارد</strong><small>تومان</small></div>
              <div><span>سفارش‌های مرتبط</span><strong>{orders.length} سفارش</strong><small>ثبت‌شده در نمونه</small></div>
              <div><span>مانده حساب</span><strong>۸۵ میلیون</strong><small className="danger-text">سررسید گذشته</small></div>
              <div><span>میانگین زمان خرید</span><strong>۴۵ روز</strong><small>از اولین تماس</small></div>
            </section>
            <section className="panel">
              <div className="panel-head"><div><h2>آخرین تعاملات</h2><p>تاریخچه ارتباط با مشتری</p></div><button className="link-button">مشاهده همه <Icon name="arrow" size={15}/></button></div>
              <div className="timeline">
                {[
                  ["phone","تماس تلفنی با حسین محمودی","پیگیری پیش‌فاکتور باتری لیفتراک؛ مشتری درخواست بازبینی زمان تحویل را داشت.","امروز، ساعت ۱۰:۲۵","teal"],
                  ["file","ارسال پیش‌فاکتور شماره ۲۳۸۴","پیش‌فاکتور ۴۲۰ میلیون تومانی برای ۲۴ دستگاه باتری ارسال شد.","۲۲ مهر ۱۴۰۳","blue"],
                  ["users","جلسه حضوری در دفتر مشتری","بررسی نیازهای فصل پاییز و معرفی سری جدید محصولات صنعتی.","۱۸ مهر ۱۴۰۳","purple"],
                ].map(([icon,title,text,date,color], index) => <div className="timeline-item" key={title}>
                  <div className={`timeline-icon ${color}`}><Icon name={icon as IconName} size={18}/></div>
                  {index < 2 && <span className="timeline-line"/>}
                  <div><strong>{title}</strong><p>{text}</p><small><Icon name="clock" size={14}/>{date} · ثبت‌شده توسط سارا احمدی</small></div>
                  <button className="more-button"><Icon name="more" size={18}/></button>
                </div>)}
              </div>
              <button className="full-button"><Icon name="plus" size={16}/> ثبت تعامل جدید</button>
            </section>
            <section className="panel opportunity">
              <div className="panel-head"><div><h2>فرصت فروش فعال</h2><p>پیش‌فاکتور باتری لیفتراک سری L</p></div><span className="status warning">در حال مذاکره</span></div>
              <div className="opportunity-info"><div><span>ارزش فرصت</span><strong>۴۲۰ میلیون تومان</strong></div><div><span>احتمال موفقیت</span><strong>٪۷۵</strong></div><div><span>تاریخ پیش‌بینی فروش</span><strong>۱۰ آبان ۱۴۰۳</strong></div></div>
              <div className="progress-label"><span>پیشرفت مسیر فروش</span><b>مرحله ۳ از ۵</b></div>
              <div className="sales-progress"><i className="done"/><i className="done"/><i className="current"/><i/><i/></div>
              <div className="progress-steps"><span>تماس اولیه</span><span>نیازسنجی</span><span>مذاکره</span><span>پیش‌فاکتور</span><span>فروش</span></div>
            </section>
          </div>
          <aside className="profile-side">
            <section className="panel contact-card">
              <div className="panel-head"><h2>اطلاعات تماس</h2><button className="more-button"><Icon name="edit" size={17}/></button></div>
              <div className="contact-person"><div className="person-avatar">{customer.contactName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><strong>{customer.contactName}</strong><span>رابط اصلی مشتری</span></div><span className="status success">تصمیم‌گیرنده</span></div>
              <div className="contact-list"><div><Icon name="phone" size={18}/><span><small>شماره همراه</small><b>{customer.phone}</b></span></div><div><Icon name="mail" size={18}/><span><small>ایمیل</small><b dir="ltr">{customer.email}</b></span></div><div><Icon name="location" size={18}/><span><small>نشانی</small><b>{customer.location}</b></span></div></div>
            </section>
            <section className="panel next-action">
              <div className="panel-head"><h2>اقدام بعدی</h2><span className="tag orange">اولویت بالا</span></div>
              <strong>تماس برای نهایی‌سازی پیش‌فاکتور</strong><p>هماهنگی زمان تحویل و شرایط پرداخت با آقای محمودی</p>
              <div className="action-date"><Icon name="calendar" size={18}/><div><span>زمان پیگیری</span><b>فردا، ۲۵ مهر · ساعت ۱۰:۰۰</b></div></div>
              <div className="action-buttons"><button className="outline-button"><Icon name="check" size={17}/> انجام شد</button><button className="primary-button"><Icon name="phone" size={17}/> شروع تماس</button></div>
            </section>
            <section className="panel interests">
              <div className="panel-head"><h2>علاقه‌مندی محصولات</h2><button className="more-button"><Icon name="plus" size={17}/></button></div>
              <div><span>باتری لیفتراک سری L</span><b>علاقه زیاد</b></div><div><span>باتری یوپی‌اس صنعتی</span><b>علاقه متوسط</b></div><div><span>خدمات نگهداری دوره‌ای</span><b>در حال بررسی</b></div>
            </section>
          </aside>
        </div>}
      </main>
    </>
  );
}

