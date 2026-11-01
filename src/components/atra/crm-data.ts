export type CustomerType = "حقوقی" | "حقیقی" | "نماینده";

export type Customer = {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  type: CustomerType;
  industry: string;
  location: string;
  owner: string;
  status: "فعال" | "نیازمند پیگیری";
  lastInteraction: string;
};

export const orderStatuses = [
  "ثبت سفارش",
  "تأیید قیمت",
  "مونتاژ",
  "کنترل کیفیت",
  "آماده تحویل",
  "تحویل‌شده",
  "انتظار قطعه",
  "تحویل جزئی",
  "لغوشده",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export type BatteryOrder = {
  id: string;
  customerId: string;
  batteryModel: string;
  quantity: number;
  /** Display text in the existing «۴۲۰ میلیون» style; the page appends «تومان». */
  amount: string;
  /** Exact Toman value. Set on new orders only; demo/older records stay text-only until an approved migration. */
  amountValue?: number;
  /** Shamsi display text such as «۱۰ آبان ۱۴۰۳». */
  deliveryDate: string;
  /** ISO calendar date ("2024-10-31") behind the Shamsi display. New orders only. */
  deliveryDateIso?: string;
  status: OrderStatus;
  /** Append-only status log; optional so older saved demo orders still load. */
  history?: { from: OrderStatus; to: OrderStatus; at: string }[];
};

export type CrmTask = {
  id: string;
  title: string;
  /** Customer name for display (unchanged rendering). */
  customer: string;
  /** Customer id for new tasks, so renaming a customer never breaks the link. Older tasks keep the name only. */
  customerId?: string;
  /** Shamsi display text such as «۲۶ مهر ۱۴۰۳». */
  date: string;
  /** ISO calendar date behind the Shamsi display. New tasks only. */
  dateIso?: string;
  time: string;
  group: "امروز" | "آینده" | "عقب‌افتاده";
  type: "تماس" | "جلسه" | "وظیفه" | "سفارش";
  completed: boolean;
};

export const demoCustomers: Customer[] = [
  {
    id: "cus-101",
    name: "صنایع آریا شرق",
    contactName: "حسین محمودی",
    phone: "۰۹۱۲ ۳۴۵ ۷۸۹۰",
    email: "h.mahmoudi@example.ir",
    type: "حقوقی",
    industry: "تجهیزات صنعتی و باتری تخصصی",
    location: "تهران، شهرک صنعتی شمس‌آباد",
    owner: "سارا احمدی",
    status: "نیازمند پیگیری",
    lastInteraction: "۶ روز پیش",
  },
  {
    id: "cus-102",
    name: "پارس تجهیز البرز",
    contactName: "نگار شریفی",
    phone: "۰۹۱۲ ۱۱۱ ۴۸۲۰",
    email: "n.sharifi@example.ir",
    type: "نماینده",
    industry: "توزیع تجهیزات انبارداری",
    location: "کرج، منطقه صنعتی بهارستان",
    owner: "احسان باقری",
    status: "فعال",
    lastInteraction: "۳ روز پیش",
  },
  {
    id: "cus-103",
    name: "توسعه انرژی پویا",
    contactName: "رضا عزیزی",
    phone: "۰۹۱۰ ۵۵۲ ۳۱۹۰",
    email: "r.azizi@example.ir",
    type: "حقوقی",
    industry: "راهکارهای برق اضطراری",
    location: "اصفهان، شهرک صنعتی محمودآباد",
    owner: "علی رضایی",
    status: "فعال",
    lastInteraction: "امروز",
  },
  {
    id: "cus-104",
    name: "فروشگاه باتری نیرو",
    contactName: "مریم توکلی",
    phone: "۰۹۳۵ ۸۲۰ ۱۷۶۴",
    email: "m.tavakoli@example.ir",
    type: "حقیقی",
    industry: "فروش باتری و لوازم برق",
    location: "قم، بلوار امین",
    owner: "سارا احمدی",
    status: "فعال",
    lastInteraction: "دیروز",
  },
];

export const demoOrders: BatteryOrder[] = [
  { id: "سفارش ۲۴۸۱", customerId: "cus-101", batteryModel: "لیفتراک L-24", quantity: 24, amount: "۴۲۰ میلیون", deliveryDate: "۱۰ آبان ۱۴۰۳", status: "تأیید قیمت" },
  { id: "سفارش ۲۴۷۸", customerId: "cus-102", batteryModel: "UPS صنعتی U-12", quantity: 12, amount: "۲۸۵ میلیون", deliveryDate: "۲۸ مهر ۱۴۰۳", status: "مونتاژ" },
  { id: "سفارش ۲۴۷۲", customerId: "cus-103", batteryModel: "سلول ۲ ولت OPzS", quantity: 48, amount: "۳۶۰ میلیون", deliveryDate: "۵ آبان ۱۴۰۳", status: "انتظار قطعه" },
  { id: "سفارش ۲۴۶۹", customerId: "cus-104", batteryModel: "باتری VRLA-100", quantity: 8, amount: "۹۶ میلیون", deliveryDate: "۲۵ مهر ۱۴۰۳", status: "آماده تحویل" },
  { id: "سفارش ۲۴۵۸", customerId: "cus-101", batteryModel: "لیفتراک L-18", quantity: 6, amount: "۱۰۸ میلیون", deliveryDate: "۱۵ مهر ۱۴۰۳", status: "تحویل‌شده" },
];

export const demoTasks: CrmTask[] = [
  { id: "task-1", title: "تماس برای نهایی‌سازی پیش‌فاکتور", customer: "صنایع آریا شرق", date: "۲۴ مهر ۱۴۰۳", time: "۰۹:۳۰", group: "امروز", type: "تماس", completed: false },
  { id: "task-2", title: "جلسه بررسی نیاز سه‌ماهه چهارم", customer: "پارس تجهیز البرز", date: "۲۴ مهر ۱۴۰۳", time: "۱۱:۰۰", group: "امروز", type: "جلسه", completed: false },
  { id: "task-3", title: "بررسی نتیجه کنترل کیفیت", customer: "فروشگاه باتری نیرو", date: "۲۴ مهر ۱۴۰۳", time: "۱۶:۰۰", group: "امروز", type: "سفارش", completed: true },
  { id: "task-4", title: "ارسال پیشنهاد خدمات نگهداری", customer: "توسعه انرژی پویا", date: "۲۶ مهر ۱۴۰۳", time: "۱۰:۳۰", group: "آینده", type: "وظیفه", completed: false },
  { id: "task-5", title: "پیگیری تأیید شرایط پرداخت", customer: "صنایع آریا شرق", date: "۲۱ مهر ۱۴۰۳", time: "۱۴:۰۰", group: "عقب‌افتاده", type: "تماس", completed: false },
];
