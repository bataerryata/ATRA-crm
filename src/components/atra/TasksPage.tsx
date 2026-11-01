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
import { formatJalaliDate, parseJalaliDate } from "./dates";

export function TaskForm({ customers, onSave, onClose }: { customers: Customer[]; onSave: (task: CrmTask) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customerId = String(form.get("customer"));
    const customer = customers.find((item) => item.id === customerId);
    const dateIso = parseJalaliDate(form.get("date"));
    if (!customer || dateIso === null) return;
    onSave({
      id: `task-${Date.now()}`,
      title: String(form.get("title")),
      customer: customer.name,
      customerId: customer.id,
      date: formatJalaliDate(dateIso) ?? String(form.get("date")),
      dateIso,
      time: String(form.get("time")),
      group: String(form.get("group")) as CrmTask["group"],
      type: String(form.get("type")) as CrmTask["type"],
      completed: false,
    });
  }
  return <Modal title="ثبت فعالیت جدید" description="پیگیری جدید را به برنامه کاری اضافه کنید." onClose={onClose}>
    <form className="crm-form" onSubmit={submit}>
      <label className="form-wide"><span>عنوان فعالیت</span><input name="title" required placeholder="مثلاً تماس برای تأیید پیش‌فاکتور"/></label>
      <label><span>مشتری</span><select name="customer">{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
      <label><span>نوع فعالیت</span><select name="type"><option>تماس</option><option>جلسه</option><option>وظیفه</option><option>سفارش</option></select></label>
      <label><span>بازه زمانی</span><select name="group"><option>امروز</option><option>آینده</option><option>عقب‌افتاده</option></select></label>
      <label><span>تاریخ شمسی</span><input name="date" required placeholder="۲۶ مهر ۱۴۰۳"/></label>
      <label><span>ساعت</span><input name="time" required placeholder="۱۰:۳۰"/></label>
      <div className="form-actions"><button type="button" className="outline-button" onClick={onClose}>انصراف</button><button className="primary-button" type="submit"><Icon name="plus" size={17}/> افزودن فعالیت</button></div>
    </form>
  </Modal>;
}

export function TasksPage({ tasks, onCreate, onToggle }: { tasks: CrmTask[]; onCreate: () => void; onToggle: (id: string) => void }) {
  const [group, setGroup] = useState<CrmTask["group"]>("امروز");
  const visible = tasks.filter((task) => task.group === group);
  return <>
    <Header page="وظایف و تقویم" onQuickAdd={onCreate}/>
    <main className="content">
      <section className="task-summary">
        {(["امروز", "آینده", "عقب‌افتاده"] as const).map((item) => <button key={item} className={group === item ? "active" : ""} onClick={() => setGroup(item)}><span>{item}</span><strong>{tasks.filter((task) => task.group === item && !task.completed).length}</strong><small>{item === "امروز" ? "فعالیت در برنامه" : item === "آینده" ? "پیگیری برنامه‌ریزی‌شده" : "نیازمند رسیدگی"}</small></button>)}
      </section>
      <section className="panel task-board">
        <div className="data-panel-head"><div><h2>فعالیت‌های {group}</h2><p>با انتخاب دایره، فعالیت به‌عنوان انجام‌شده ثبت می‌شود.</p></div><button className="primary-button" onClick={onCreate}><Icon name="plus" size={17}/> فعالیت جدید</button></div>
        <div className="full-task-list">
          {visible.map((task) => <div className={`full-task-row ${task.completed ? "completed" : ""} ${task.group === "عقب‌افتاده" ? "overdue" : ""}`} key={task.id}>
            <button className="task-check" onClick={() => onToggle(task.id)} aria-label={task.completed ? "بازگرداندن فعالیت" : "علامت‌گذاری به‌عنوان انجام‌شده"}>{task.completed && <Icon name="check" size={15}/>}</button>
            <div className={`task-marker ${task.type === "تماس" ? "teal" : task.type === "جلسه" ? "blue" : task.type === "سفارش" ? "purple" : "orange"}`}><Icon name={task.type === "تماس" ? "phone" : task.type === "جلسه" ? "users" : task.type === "سفارش" ? "box" : "check"} size={17}/></div>
            <div className="full-task-copy"><strong>{task.title}</strong><span>{task.customer}</span></div>
            <div className="task-date"><Icon name="calendar" size={15}/><span>{task.date}</span><b>{task.time}</b></div>
            <span className={`tag ${task.group === "عقب‌افتاده" ? "orange" : "teal"}`}>{task.completed ? "انجام‌شده" : task.group}</span>
          </div>)}
        </div>
      </section>
    </main>
  </>;
}
