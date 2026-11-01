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

export function StatCard({ title, value, detail, icon, tone, trend }: { title: string; value: string; detail: string; icon: IconName; tone: string; trend?: string }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon name={icon} size={21}/></div>
      <div className="stat-title">{title}<button aria-label="جزئیات"><Icon name="more" size={18}/></button></div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-detail">{trend && <span>{trend}</span>} {detail}</div>
    </article>
  );
}

export const chartPoints = "0,145 45,128 90,136 135,92 180,106 225,68 270,75 315,38 360,58 405,20 450,34 500,5";

export function SalesChart() {
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <div><h2>روند فروش</h2><p>عملکرد شش ماه اخیر</p></div>
        <div className="chart-meta"><span><i className="legend actual"/>فروش قطعی</span><span><i className="legend target"/>هدف فروش</span><button className="select-button">شش ماه اخیر <Icon name="chevron" size={15}/></button></div>
      </div>
      <div className="chart-summary"><strong>۱۲٫۴ میلیارد</strong><span>تومان</span><b>٪۱۸٫۲ +</b><small>نسبت به دوره قبل</small></div>
      <div className="chart-wrap">
        <div className="y-axis"><span>۵ میلیارد</span><span>۳٫۷۵</span><span>۲٫۵</span><span>۱٫۲۵</span><span>۰</span></div>
        <svg viewBox="0 0 500 160" preserveAspectRatio="none" className="line-chart" aria-label="نمودار فروش">
          <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12a594" stopOpacity=".22"/><stop offset="1" stopColor="#12a594" stopOpacity="0"/></linearGradient></defs>
          <g className="grid-lines"><line x1="0" y1="5" x2="500" y2="5"/><line x1="0" y1="43" x2="500" y2="43"/><line x1="0" y1="81" x2="500" y2="81"/><line x1="0" y1="119" x2="500" y2="119"/><line x1="0" y1="157" x2="500" y2="157"/></g>
          <polyline points="0,132 45,118 90,106 135,97 180,89 225,77 270,65 315,55 360,44 405,31 450,19 500,8" className="target-line"/>
          <polygon points={`${chartPoints} 500,160 0,160`} fill="url(#area)"/>
          <polyline points={chartPoints} className="actual-line"/>
          {[["135","92"],["225","68"],["315","38"],["405","20"]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="4" className="chart-dot"/>)}
        </svg>
        <div className="x-axis"><span>اردیبهشت</span><span>خرداد</span><span>تیر</span><span>مرداد</span><span>شهریور</span><span>مهر</span></div>
      </div>
    </section>
  );
}

export const tasks = [
  { time: "۰۹:۳۰", title: "تماس با شرکت آریا صنعت", text: "پیگیری پیش‌فاکتور باتری لیفتراک", type: "تماس", color: "teal" },
  { time: "۱۱:۰۰", title: "جلسه با پارس خودرو", text: "بررسی نیاز سه‌ماهه چهارم", type: "جلسه", color: "blue" },
  { time: "۱۳:۳۰", title: "ارسال پیشنهاد قیمت", text: "صنایع غذایی سپهر", type: "وظیفه", color: "orange" },
  { time: "۱۶:۰۰", title: "کنترل سفارش ۲۴۸۱", text: "تأیید نهایی واحد کنترل کیفیت", type: "سفارش", color: "purple" },
];

export function TodayTasks() {
  return (
    <section className="panel tasks-panel">
      <div className="panel-head"><div><h2>برنامه امروز</h2><p>۸ فعالیت برنامه‌ریزی‌شده</p></div><button className="link-button">مشاهده تقویم <Icon name="arrow" size={15}/></button></div>
      <div className="task-list">
        {tasks.map((task) => <div className="task-row" key={task.time}>
          <div className="task-time">{task.time}<span/></div>
          <div className={`task-marker ${task.color}`}><Icon name={task.type === "تماس" ? "phone" : task.type === "جلسه" ? "users" : task.type === "سفارش" ? "box" : "check"} size={17}/></div>
          <div className="task-copy"><strong>{task.title}</strong><span>{task.text}</span></div>
          <span className={`tag ${task.color}`}>{task.type}</span>
          <button className="more-button"><Icon name="more" size={18}/></button>
        </div>)}
      </div>
      <button className="full-button"><Icon name="plus" size={16}/> افزودن فعالیت جدید</button>
    </section>
  );
}

export function Dashboard({ setPage, openQuickAdd }: { setPage: (page: Page) => void; openQuickAdd: () => void }) {
  return (
    <>
      <Header page="داشبورد" onQuickAdd={openQuickAdd}/>
      <main className="content">
        <div className="insight-banner">
          <div className="insight-icon"><Icon name="spark" size={22}/></div>
          <div><strong>پیشنهاد دستیار آتا</strong><p>سه مشتری با احتمال خرید بالا، بیش از ۵ روز است که پیگیری نشده‌اند.</p></div>
          <button onClick={() => setPage("دستیار هوشمند")}>مشاهده پیشنهادها <Icon name="arrow" size={16}/></button>
          <button className="close-button">×</button>
        </div>
        <section className="stats-grid">
          <StatCard title="فروش این ماه" value="۲٫۴۸ میلیارد" detail="نسبت به ماه قبل" trend="٪۱۲٫۵ +" icon="wallet" tone="teal"/>
          <StatCard title="پیگیری‌های امروز" value="۸ مورد" detail="۳ مورد اولویت بالا" icon="phone" tone="blue"/>
          <StatCard title="کارهای عقب‌افتاده" value="۵ مورد" detail="نیازمند رسیدگی" icon="clock" tone="orange"/>
          <StatCard title="سفارش‌های متوقف" value="۳ سفارش" detail="ارزش ۴۸۰ میلیون" icon="box" tone="red"/>
        </section>
        <div className="dashboard-grid"><SalesChart/><TodayTasks/></div>
        <section className="panel customers-panel">
          <div className="panel-head"><div><h2>مشتریان نیازمند توجه</h2><p>بر اساس اولویت و زمان آخرین تعامل</p></div><button className="link-button" onClick={() => setPage("مشتریان")}>مشاهده همه مشتریان <Icon name="arrow" size={15}/></button></div>
          <div className="customer-table">
            <div className="table-head"><span>مشتری</span><span>آخرین تعامل</span><span>فرصت فروش</span><span>مسئول پیگیری</span><span>وضعیت</span><span/></div>
            {[
              ["صنایع آریا شرق","حسین محمودی","۶ روز پیش","۴۲۰ میلیون","سارا احمدی","پیگیری فوری","danger","ص"],
              ["پارس تجهیز البرز","نگار شریفی","۳ روز پیش","۲۸۵ میلیون","امیر نادری","مذاکره","warning","پ"],
              ["توسعه انرژی پویا","رضا عزیزی","امروز","۱۹۰ میلیون","علی رضایی","پیش‌فاکتور","info","ت"],
            ].map((row) => <button className="table-row" key={row[0]}>
              <span className="customer-name"><b className="mini-avatar">{row[7]}</b><span><strong>{row[0]}</strong><small>{row[1]}</small></span></span>
              <span>{row[2]}</span><span>{row[3]}</span><span className="assignee"><b>{(row[4] ?? "").slice(0,1)}</b>{row[4]}</span><span><i className={`status ${row[6]}`}>{row[5]}</i></span><Icon name="chevron" size={17}/>
            </button>)}
          </div>
        </section>
      </main>
    </>
  );
}
