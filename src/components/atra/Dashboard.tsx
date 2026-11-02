import { demoOrders } from "./crm-data";
import { Icon, Header, type IconName, type Page } from "./shared";

export function StatCard({
  title,
  value,
  detail,
  icon,
  tone,
  trend,
}: {
  title: string;
  value: string;
  detail: string;
  icon: IconName;
  tone: string;
  trend?: string;
}) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className={`stat-icon ${tone}`}>
        <Icon name={icon} size={21} />
      </div>
      <div className="stat-title">
        <span>{title}</span>
        <button aria-label="جزئیات">
          <Icon name="more" size={18} />
        </button>
      </div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-detail">
        {trend && <span>{trend}</span>} {detail}
      </div>
    </article>
  );
}

export const chartPoints =
  "0,145 45,128 90,136 135,92 180,106 225,68 270,75 315,38 360,58 405,20 450,34 500,5";

export function SalesChart() {
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <div>
          <span className="section-kicker">تحلیل فروش</span>
          <h2>روند فروش</h2>
          <p>عملکرد 6 ماه اخیر · داده نمایشی</p>
        </div>
        <div className="chart-meta">
          <span>
            <i className="legend actual" />
            فروش قطعی
          </span>
          <span>
            <i className="legend target" />
            هدف فروش
          </span>
          <button className="select-button">
            6 ماه اخیر <Icon name="chevron" size={15} />
          </button>
        </div>
      </div>
      <div className="chart-summary">
        <strong>12.4 میلیارد</strong>
        <span>تومان</span>
        <b>18.2% +</b>
        <small>نسبت به دوره قبل</small>
      </div>
      <div className="chart-wrap">
        <div className="y-axis">
          <span>5 میلیارد</span>
          <span>3.75</span>
          <span>2.5</span>
          <span>1.25</span>
          <span>0</span>
        </div>
        <svg
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
          className="line-chart"
          aria-label="نمودار فروش"
        >
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--teal)" stopOpacity=".26" />
              <stop offset="1" stopColor="var(--teal)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="grid-lines">
            <line x1="0" y1="5" x2="500" y2="5" />
            <line x1="0" y1="43" x2="500" y2="43" />
            <line x1="0" y1="81" x2="500" y2="81" />
            <line x1="0" y1="119" x2="500" y2="119" />
            <line x1="0" y1="157" x2="500" y2="157" />
          </g>
          <polyline
            points="0,132 45,118 90,106 135,97 180,89 225,77 270,65 315,55 360,44 405,31 450,19 500,8"
            className="target-line"
          />
          <polygon points={`${chartPoints} 500,160 0,160`} fill="url(#area)" />
          <polyline points={chartPoints} className="actual-line" />
          {[
            ["135", "92"],
            ["225", "68"],
            ["315", "38"],
            ["405", "20"],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4" className="chart-dot" />
          ))}
        </svg>
        <div className="chart-tooltip">
          <span>شهریور 1403</span>
          <strong>4.2 میلیارد تومان</strong>
          <small>12% بالاتر از هدف</small>
        </div>
        <div className="x-axis">
          <span>اردیبهشت</span>
          <span>خرداد</span>
          <span>تیر</span>
          <span>مرداد</span>
          <span>شهریور</span>
          <span>مهر</span>
        </div>
      </div>
    </section>
  );
}

export const tasks = [
  {
    time: "09:30",
    title: "تماس با شرکت آریا صنعت",
    text: "پیگیری پیش‌فاکتور باتری لیفتراک",
    type: "تماس",
    color: "teal",
  },
  {
    time: "11:00",
    title: "جلسه با پارس خودرو",
    text: "بررسی نیاز سه‌ماهه چهارم",
    type: "جلسه",
    color: "blue",
  },
  {
    time: "13:30",
    title: "ارسال پیشنهاد قیمت",
    text: "صنایع غذایی سپهر",
    type: "وظیفه",
    color: "orange",
  },
  {
    time: "16:00",
    title: "کنترل سفارش 2481",
    text: "تأیید نهایی واحد کنترل کیفیت",
    type: "سفارش",
    color: "purple",
  },
];

export function TodayTasks() {
  return (
    <section className="panel tasks-panel">
      <div className="panel-head">
        <div>
          <span className="section-kicker">برنامه عملیاتی</span>
          <h2>برنامه امروز</h2>
          <p>8 فعالیت برنامه‌ریزی‌شده · نمایشی</p>
        </div>
        <button className="link-button">
          مشاهده تقویم <Icon name="arrow" size={15} />
        </button>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-row" key={task.time}>
            <div className="task-time">
              {task.time}
              <span />
            </div>
            <div className={`task-marker ${task.color}`}>
              <Icon
                name={
                  task.type === "تماس"
                    ? "phone"
                    : task.type === "جلسه"
                      ? "users"
                      : task.type === "سفارش"
                        ? "box"
                        : "check"
                }
                size={17}
              />
            </div>
            <div className="task-copy">
              <strong>{task.title}</strong>
              <span>{task.text}</span>
            </div>
            <span className={`tag ${task.color}`}>{task.type}</span>
            <button className="more-button">
              <Icon name="more" size={18} />
            </button>
          </div>
        ))}
      </div>
      <button className="full-button">
        <Icon name="plus" size={16} /> افزودن فعالیت جدید
      </button>
    </section>
  );
}

export function OrderPulse() {
  const production = demoOrders.filter((order) =>
    ["مونتاژ", "کنترل کیفیت"].includes(order.status),
  ).length;
  const ready = demoOrders.filter((order) => order.status === "آماده تحویل").length;
  const attention = demoOrders.filter((order) =>
    ["انتظار قطعه", "تحویل جزئی"].includes(order.status),
  ).length;
  return (
    <section className="panel order-pulse">
      <div className="order-pulse-copy">
        <span className="section-kicker">چرخه سفارش</span>
        <h2>وضعیت عملیات تحویل</h2>
        <p>برگرفته از سفارش‌های نمایشی موجود</p>
      </div>
      <div className="order-pulse-items">
        <div className="pulse-item blue">
          <span>
            <Icon name="file" size={18} /> کل سفارش‌ها
          </span>
          <strong>{demoOrders.length}</strong>
        </div>
        <div className="pulse-item violet">
          <span>
            <Icon name="settings" size={18} /> در حال تولید
          </span>
          <strong>{production}</strong>
        </div>
        <div className="pulse-item teal">
          <span>
            <Icon name="check" size={18} /> آماده تحویل
          </span>
          <strong>{ready}</strong>
        </div>
        <div className="pulse-item coral">
          <span>
            <Icon name="clock" size={18} /> نیازمند توجه
          </span>
          <strong>{attention}</strong>
        </div>
      </div>
    </section>
  );
}

export function Dashboard({
  setPage,
  openQuickAdd,
}: {
  setPage: (page: Page) => void;
  openQuickAdd: () => void;
}) {
  return (
    <>
      <Header page="داشبورد" onQuickAdd={openQuickAdd} />
      <main className="content">
        <div className="insight-banner">
          <div className="insight-icon">
            <Icon name="spark" size={22} />
          </div>
          <div>
            <div className="insight-title">
              <strong>پیشنهاد دستیار آترا</strong>
              <span>تحلیل نمایشی</span>
            </div>
            <p>3 مشتری با احتمال خرید بالا، بیش از 5 روز است که پیگیری نشده‌اند.</p>
          </div>
          <button onClick={() => setPage("دستیار هوشمند")}>
            مشاهده پیشنهادها <Icon name="arrow" size={16} />
          </button>
          <button className="close-button" aria-label="بستن پیشنهاد">
            ×
          </button>
        </div>
        <section className="stats-grid">
          <StatCard
            title="فروش این ماه"
            value="2.48 میلیارد"
            detail="نسبت به ماه قبل"
            trend="12.5% +"
            icon="wallet"
            tone="teal"
          />
          <StatCard
            title="پیگیری‌های امروز"
            value="8 مورد"
            detail="3 مورد اولویت بالا"
            icon="phone"
            tone="blue"
          />
          <StatCard
            title="کارهای عقب‌افتاده"
            value="5 مورد"
            detail="نیازمند رسیدگی"
            icon="clock"
            tone="orange"
          />
          <StatCard
            title="سفارش‌های متوقف"
            value="3 سفارش"
            detail="ارزش 480 میلیون"
            icon="box"
            tone="red"
          />
        </section>
        <OrderPulse />
        <div className="dashboard-grid">
          <SalesChart />
          <TodayTasks />
        </div>
        <section className="panel customers-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">فعالیت مشتریان</span>
              <h2>مشتریان نیازمند توجه</h2>
              <p>بر اساس اولویت و زمان آخرین تعامل · داده نمایشی</p>
            </div>
            <button className="link-button" onClick={() => setPage("مشتریان")}>
              مشاهده همه مشتریان <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="customer-table">
            <div className="table-head">
              <span>مشتری</span>
              <span>آخرین تعامل</span>
              <span>فرصت فروش</span>
              <span>مسئول پیگیری</span>
              <span>وضعیت</span>
              <span />
            </div>
            {[
              [
                "صنایع آریا شرق",
                "حسین محمودی",
                "6 روز پیش",
                "420 میلیون",
                "سارا احمدی",
                "پیگیری فوری",
                "danger",
                "ص",
              ],
              [
                "پارس تجهیز البرز",
                "نگار شریفی",
                "3 روز پیش",
                "285 میلیون",
                "امیر نادری",
                "مذاکره",
                "warning",
                "پ",
              ],
              [
                "توسعه انرژی پویا",
                "رضا عزیزی",
                "امروز",
                "190 میلیون",
                "علی رضایی",
                "پیش‌فاکتور",
                "info",
                "ت",
              ],
            ].map((row) => (
              <button className="table-row" key={row[0]}>
                <span className="customer-name">
                  <b className="mini-avatar">{row[7]}</b>
                  <span>
                    <strong>{row[0]}</strong>
                    <small>{row[1]}</small>
                  </span>
                </span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
                <span className="assignee">
                  <b>{(row[4] ?? "").slice(0, 1)}</b>
                  {row[4]}
                </span>
                <span>
                  <i className={`status ${row[6]}`}>{row[5]}</i>
                </span>
                <Icon name="chevron" size={17} />
              </button>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
