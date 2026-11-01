// Read-only migration preview screen (hidden address /migration-preview).
// Shows current vs proposed values for legacy orders/tasks. It receives the
// app state as props and never calls any setter or storage API — nothing is
// written until the owner approves docs/MIGRATION-PLAN.md separately.
import type { BatteryOrder, CrmTask, Customer } from "./crm-data";
import { buildMigrationPreview, type FieldStatus, type RecordPreview } from "./migration-preview";
import { Icon } from "./shared";

const statusTag: Record<FieldStatus, { className: string; label: string }> = {
  ready: { className: "tag teal", label: "آماده تبدیل" },
  converted: { className: "neutral-badge", label: "از قبل دقیق است" },
  ambiguous: { className: "tag orange", label: "نیازمند بررسی" },
};

function PreviewTable({ title, subtitle, rows }: { title: string; subtitle: string; rows: RecordPreview[] }) {
  return (
    <section className="panel data-panel">
      <div className="data-panel-head"><div><h2>{title}</h2><p>{subtitle}</p></div><span className="demo-label">فقط‌خواندنی</span></div>
      <div className="crm-table migration-table">
        <div className="crm-table-head"><span>شناسه</span><span>فیلد</span><span>مقدار فعلی</span><span>مقدار پیشنهادی</span><span>وضعیت</span></div>
        {rows.flatMap((row) => row.fields.map((field) => (
          <div className="crm-table-row" key={`${row.id}-${field.field}`}>
            <span className="order-identity"><strong>{row.id}</strong></span>
            <span>{field.field}</span>
            <span>{field.current}</span>
            <span>{field.status === "ambiguous" ? <span className="danger-text">{field.reason}</span> : field.proposed}</span>
            <span><i className={statusTag[field.status].className}>{statusTag[field.status].label}</i></span>
          </div>
        )))}
      </div>
    </section>
  );
}

export function MigrationPreview({ orders, tasks, customers }: { orders: BatteryOrder[]; tasks: CrmTask[]; customers: Customer[] }) {
  const preview = buildMigrationPreview(orders, tasks, customers);
  const { summary } = preview;
  return (
    <main className="content">
      <section className="page-toolbar">
        <div className="toolbar-title">
          <strong>پیش‌نمایش تبدیل داده‌های قدیمی</strong>
          <span>این صفحه فقط گزارش است و هیچ داده‌ای را تغییر نمی‌دهد. تبدیل واقعی فقط پس از تأیید جداگانهٔ مدیر اصلی انجام می‌شود. واحد همهٔ مبالغ: تومان.</span>
        </div>
      </section>
      <section className="order-stats">
        <div><span>تعداد رکوردها (قبل)</span><strong>{summary.before}</strong></div>
        <div><span>تعداد رکوردها (بعد)</span><strong>{summary.after}</strong></div>
        <div><span>آماده تبدیل</span><strong>{summary.ready}</strong></div>
        <div><span>نیازمند بررسی</span><strong className="danger-text">{summary.ambiguous}</strong></div>
      </section>
      <PreviewTable title="سفارش‌ها" subtitle={`${summary.converted} رکورد از قبل مقدار دقیق دارند و دست‌نخورده می‌مانند.`} rows={preview.orders} />
      <PreviewTable title="فعالیت‌ها" subtitle="پیوند مشتری بر اساس نام فعلی پیشنهاد می‌شود." rows={preview.tasks} />
      <section className="page-toolbar">
        <div className="toolbar-title">
          <span><Icon name="check" size={14}/> تعداد رکوردها قبل و بعد برابر است؛ هیچ رکوردی حذف یا اضافه نمی‌شود. برای اجرای تبدیل، برنامهٔ docs/MIGRATION-PLAN.md باید جداگانه تأیید شود.</span>
        </div>
      </section>
    </main>
  );
}
