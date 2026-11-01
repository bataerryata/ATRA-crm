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

export type ChatMessage = { id: number; role: "assistant" | "user"; text: string };
export const assistantSuggestions = ["مشتریان نیازمند پیگیری را نشان بده", "سفارش‌های معوق کدام‌اند؟", "برنامه امروز من چیست؟"];

export function AssistantPage({ tasks, orders }: { tasks: CrmTask[]; orders: BatteryOrder[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, role: "assistant", text: "سلام احسان. من نسخه نمایشی دستیار آتا هستم. می‌توانم بر اساس داده‌های ساختگی این نمونه، پیگیری‌ها و سفارش‌های نیازمند توجه را خلاصه کنم." }]);
  const [input, setInput] = useState("");
  function send(text: string) {
    if (!text.trim()) return;
    const delayedOrders = orders.filter((order) => ["انتظار قطعه", "لغوشده", "تحویل جزئی"].includes(order.status)).length;
    const overdue = tasks.filter((task) => task.group === "عقب‌افتاده" && !task.completed).length;
    const response = text.includes("سفارش") ? `${delayedOrders} سفارش نیازمند بررسی است. پیشنهاد می‌کنم ابتدا سفارش‌های در انتظار قطعه را با واحد تأمین هماهنگ کنید. این پاسخ نمایشی است.` : text.includes("امروز") ? `برای امروز ${tasks.filter((task) => task.group === "امروز" && !task.completed).length} فعالیت باز دارید. این پاسخ نمایشی است و به تقویم واقعی متصل نیست.` : `${overdue} پیگیری عقب‌افتاده و یک مشتری با اولویت بالا شناسایی شد. پیشنهاد می‌کنم تماس با صنایع آریا شرق در اولویت باشد. این پاسخ نمایشی است.`;
    setMessages((current) => [...current, { id: Date.now(), role: "user", text }, { id: Date.now() + 1, role: "assistant", text: response }]);
    setInput("");
  }
  return <>
    <Header page="دستیار هوشمند" onQuickAdd={() => send("برنامه امروز من چیست؟")}/>
    <main className="content assistant-page">
      <div className="assistant-layout">
        <section className="panel chat-panel">
          <div className="chat-head"><div className="assistant-icon-large"><Icon name="spark" size={24}/></div><div><strong>دستیار آتا</strong><span>حالت نمایشی · بدون اتصال به مدل هوش مصنوعی</span></div><i>آنلاین نمایشی</i></div>
          <div className="messages">
            {messages.map((message) => <div className={`message ${message.role}`} key={message.id}>{message.role === "assistant" && <div className="chat-avatar"><Icon name="spark" size={16}/></div>}<p>{message.text}</p></div>)}
          </div>
          <div className="suggestion-chips">{assistantSuggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>)}</div>
          <form className="chat-input" onSubmit={(event) => { event.preventDefault(); send(input); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="پیام خود را بنویسید..."/><button aria-label="ارسال پیام"><Icon name="arrow" size={19}/></button></form>
          <p className="ai-disclaimer">پاسخ‌ها صرفاً نمایشی هستند و نباید مبنای تصمیم مالی یا عملیاتی قرار گیرند.</p>
        </section>
        <aside className="assistant-side">
          <section className="panel smart-card"><div className="smart-card-icon warning"><Icon name="clock" size={20}/></div><div><span>پیگیری‌های عقب‌افتاده</span><strong>{tasks.filter((task) => task.group === "عقب‌افتاده" && !task.completed).length} مورد</strong></div><button onClick={() => send("مشتریان نیازمند پیگیری را نشان بده")}><Icon name="chevron" size={17}/></button></section>
          <section className="panel smart-card"><div className="smart-card-icon danger"><Icon name="box" size={20}/></div><div><span>سفارش‌های نیازمند توجه</span><strong>{orders.filter((order) => ["انتظار قطعه", "تحویل جزئی"].includes(order.status)).length} مورد</strong></div><button onClick={() => send("سفارش‌های معوق کدام‌اند؟")}><Icon name="chevron" size={17}/></button></section>
          <section className="panel assistant-note"><Icon name="spark" size={22}/><strong>درباره این نسخه</strong><p>هیچ مدل هوش مصنوعی یا سرویس خارجی فعال نیست. پاسخ‌ها از چند الگوی ثابت و داده‌های ساختگی همین مرورگر تولید می‌شوند.</p></section>
        </aside>
      </div>
    </main>
  </>;
}
