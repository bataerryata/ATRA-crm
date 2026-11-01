import { useState } from "react";
import { useLocation, useRouter } from "@tanstack/react-router";
import { demoCustomers, demoOrders, demoTasks } from "./crm-data";
import { MobileNav, Sidebar, type Page } from "./shared";
import { Dashboard } from "./Dashboard";
import { CustomerProfile } from "./CustomerProfile";
import { CustomerForm, CustomersPage } from "./CustomersPage";
import { OrderForm, OrdersPage } from "./OrdersPage";
import { TaskForm, TasksPage } from "./TasksPage";
import { AssistantPage } from "./AssistantPage";
import { MigrationPreview } from "./MigrationPreview";
import { transitionOrder } from "./order-workflow";
import { usePersistentState } from "./usePersistentState";
import { customerPath, pageFromPath, pagePaths } from "./atra-paths";

export default function App() {
  // The screen comes from the URL so every section has its own direct link.
  const { pathname } = useLocation();
  const router = useRouter();
  const { page, customerId } = pageFromPath(pathname);
  const [customers, setCustomers] = usePersistentState("ata-demo-customers", demoCustomers);
  const [orders, setOrders] = usePersistentState("ata-demo-orders", demoOrders);
  const [tasks, setTasks] = usePersistentState("ata-demo-tasks", demoTasks);
  const selectedCustomerId = customerId ?? "";
  const setPage = (next: Page, id?: string) => {
    const to = next === "پرونده مشتری" ? customerPath(id ?? selectedCustomerId) : pagePaths[next];
    router.history.push(to);
  };
  const [modal, setModal] = useState<"customer" | "edit-customer" | "order" | "task" | null>(null);
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? customers[0];

  function quickAdd() {
    if (page === "سفارش‌ها") setModal("order");
    else if (page === "وظایف و تقویم") setModal("task");
    else setModal("customer");
  }

  function renderPage() {
    // Hidden read-only report; not linked from any menu. It only reads state.
    if (pathname === "/migration-preview") return <MigrationPreview orders={orders} tasks={tasks} customers={customers}/>;
    if (page === "مشتریان") return <CustomersPage customers={customers} onCreate={() => setModal("customer")} onOpen={(customer) => { setPage("پرونده مشتری", customer.id); }}/>;
    if (page === "پرونده مشتری" && selectedCustomer) return <CustomerProfile customer={selectedCustomer} orders={orders.filter((order) => order.customerId === selectedCustomer.id)} onBack={() => setPage("مشتریان")} onEdit={() => setModal("edit-customer")}/>;
    if (page === "سفارش‌ها") return <OrdersPage orders={orders} customers={customers} onCreate={() => setModal("order")} onStatusChange={(id, status) => setOrders((current) => current.map((order) => order.id === id ? transitionOrder(order, status).order : order))}/>;
    if (page === "وظایف و تقویم") return <TasksPage tasks={tasks} onCreate={() => setModal("task")} onToggle={(id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))}/>;
    if (page === "دستیار هوشمند") return <AssistantPage tasks={tasks} orders={orders}/>;
    return <Dashboard setPage={setPage} openQuickAdd={quickAdd}/>;
  }

  return (
    <div className="app" dir="rtl">
      <Sidebar page={page} setPage={setPage} openTasks={tasks.filter((task) => !task.completed).length}/>
      <div className="workspace">{renderPage()}</div>
      <MobileNav page={page} setPage={setPage} onQuickAdd={quickAdd}/>
      {modal === "customer" && <CustomerForm onClose={() => setModal(null)} onSave={(customer) => { setCustomers((current) => [customer, ...current]); setModal(null); setPage("پرونده مشتری", customer.id); }}/>}
      {modal === "edit-customer" && selectedCustomer && <CustomerForm customer={selectedCustomer} onClose={() => setModal(null)} onSave={(customer) => { setCustomers((current) => current.map((item) => item.id === customer.id ? customer : item)); setModal(null); }}/>}
      {modal === "order" && <OrderForm customers={customers} orders={orders} onClose={() => setModal(null)} onSave={(order) => { setOrders((current) => [order, ...current]); setModal(null); setPage("سفارش‌ها"); }}/>}
      {modal === "task" && <TaskForm customers={customers} onClose={() => setModal(null)} onSave={(task) => { setTasks((current) => [task, ...current]); setModal(null); setPage("وظایف و تقویم"); }}/>}
    </div>
  );
}

