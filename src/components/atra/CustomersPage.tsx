// Extracted verbatim from AtraApp.tsx; markup and classes unchanged.
import { useMemo, useState, type FormEvent } from "react";
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

export function CustomerForm({ customer, onSave, onClose }: { customer?: Customer; onSave: (customer: Customer) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: customer?.id ?? `cus-${Date.now()}`,
      name: String(form.get("name")),
      contactName: String(form.get("contactName")),
      phone: String(form.get("phone")),
      email: String(form.get("email")),
      type: String(form.get("type")) as CustomerType,
      industry: String(form.get("industry")),
      location: String(form.get("location")),
      owner: String(form.get("owner")),
      status: customer?.status ?? "فعال",
      lastInteraction: customer?.lastInteraction ?? "هنوز ثبت نشده",
    });
  }
  return <Modal title={customer ? "ویرایش مشتری" : "ثبت مشتری جدید"} description="اطلاعات این فرم کاملاً ساختگی و مخصوص نسخه نمایشی است." onClose={onClose}>
    <form className="crm-form" onSubmit={submit}>
      <label><span>نام مشتری یا شرکت</span><input name="name" required defaultValue={customer?.name} placeholder="مثلاً شرکت نمونه ایرانیان"/></label>
      <label><span>نام رابط اصلی</span><input name="contactName" required defaultValue={customer?.contactName} placeholder="نام و نام خانوادگی"/></label>
      <label><span>نوع مشتری</span><select name="type" defaultValue={customer?.type ?? "حقوقی"}><option>حقوقی</option><option>حقیقی</option><option>نماینده</option></select></label>
      <label><span>حوزه فعالیت</span><input name="industry" required defaultValue={customer?.industry} placeholder="تجهیزات صنعتی"/></label>
      <label><span>شماره تماس</span><input name="phone" required defaultValue={customer?.phone} placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰"/></label>
      <label><span>ایمیل نمایشی</span><input name="email" type="email" required defaultValue={customer?.email} placeholder="name@example.ir" dir="ltr"/></label>
      <label className="form-wide"><span>نشانی</span><input name="location" required defaultValue={customer?.location} placeholder="استان، شهر، نشانی کوتاه"/></label>
      <label className="form-wide"><span>مسئول پیگیری</span><select name="owner" defaultValue={customer?.owner ?? "احسان باقری"}><option>احسان باقری</option><option>سارا احمدی</option><option>علی رضایی</option></select></label>
      <div className="form-actions"><button type="button" className="outline-button" onClick={onClose}>انصراف</button><button className="primary-button" type="submit"><Icon name="check" size={17}/>{customer ? "ذخیره تغییرات" : "ثبت مشتری"}</button></div>
    </form>
  </Modal>;
}

export function CustomersPage({ customers, onOpen, onCreate }: { customers: Customer[]; onOpen: (customer: Customer) => void; onCreate: () => void }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"همه" | CustomerType>("همه");
  const filtered = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.name} ${customer.contactName} ${customer.phone}`.includes(query);
    return matchesQuery && (type === "همه" || customer.type === type);
  }), [customers, query, type]);

  return <>
    <Header page="مشتریان" onQuickAdd={onCreate}/>
    <main className="content">
      <section className="page-toolbar">
        <div className="toolbar-search"><Icon name="search" size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجو در نام، رابط یا شماره تماس..."/></div>
        <label className="toolbar-filter"><Icon name="filter" size={17}/><select value={type} onChange={(event) => setType(event.target.value as "همه" | CustomerType)}><option>همه</option><option>حقوقی</option><option>حقیقی</option><option>نماینده</option></select></label>
        <button className="primary-button" onClick={onCreate}><Icon name="plus" size={17}/> ثبت مشتری جدید</button>
      </section>
      <section className="summary-strip">
        <div><span>همه مشتریان</span><strong>{customers.length}</strong></div><div><span>مشتریان حقوقی</span><strong>{customers.filter((item) => item.type === "حقوقی").length}</strong></div><div><span>نیازمند پیگیری</span><strong className="danger-text">{customers.filter((item) => item.status === "نیازمند پیگیری").length}</strong></div>
      </section>
      <section className="panel data-panel">
        <div className="data-panel-head"><div><h2>فهرست مشتریان</h2><p>{filtered.length} مشتری مطابق فیلتر فعلی</p></div><span className="demo-label">داده نمایشی</span></div>
        <div className="crm-table customer-list-table">
          <div className="crm-table-head"><span>مشتری</span><span>نوع</span><span>آخرین تعامل</span><span>مسئول پیگیری</span><span>وضعیت</span><span/></div>
          {filtered.map((customer) => <button className="crm-table-row" key={customer.id} onClick={() => onOpen(customer)}>
            <span className="customer-name"><b className="mini-avatar">{customer.name.slice(0, 1)}</b><span><strong>{customer.name}</strong><small>{customer.contactName} · {customer.phone}</small></span></span>
            <span><i className="neutral-badge">{customer.type}</i></span><span>{customer.lastInteraction}</span><span>{customer.owner}</span><span><i className={`status ${customer.status === "فعال" ? "success" : "danger"}`}>{customer.status}</i></span><Icon name="chevron" size={17}/>
          </button>)}
          {!filtered.length && <div className="no-results"><Icon name="search" size={24}/><strong>مشتری‌ای پیدا نشد</strong><span>عبارت جست‌وجو یا فیلتر را تغییر دهید.</span></div>}
        </div>
      </section>
    </main>
  </>;
}
