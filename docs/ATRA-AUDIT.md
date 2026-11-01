# ATRA — Phase 1 Audit (2026-10-19)

Source inspected: `ATRA-WAP-main.zip` (Figma Make export). Verified = read in code or seen in the running preview. Assumption = stated as such.

## 0. What the upload actually is (verified)
- React 19 + Vite 8 + Tailwind v4 (unused; all styling is hand-written CSS classes), pnpm, oxfmt. Only 2 runtime deps.
- 4 source files: `App.tsx` (608 lines, every screen in one file), `crm-data.ts` (demo fixtures), `index.css` (147 lines), `main.tsx`.
- No router (page = `useState`), no backend, no auth, no tests, no env vars, no API calls, no GitHub workflow, no Figma file reference beyond `.figma/make` scripts.
- Persistence = `localStorage` per browser (`ata-demo-*` keys).
- Brand inconsistency: UI says "آتا" (ATA), product name is ATRA.

## 1. Page / module inventory
| # | Module | Status |
|---|---|---|
| 1 | Dashboard | UI only — every KPI, chart, today list and "customers needing attention" is hardcoded |
| 2 | Customers list | Partially working — search/filter/create on local demo data |
| 2b | Customer profile | Partially working — header/contact from record; KPIs, timeline, opportunity, next action, interests hardcoded; 6 of 7 tabs are placeholders |
| 3 | Products / battery models | Missing (free-text field in order form) |
| 4 | Quotations | Missing (tab placeholder only) |
| 4b | Sales orders | Partially working — list, create, status change; no line items, no validation of transitions |
| 5 | Price approval / payment terms | Missing (only a status label) |
| 6–9 | Assembly, QC, delivery, partial delivery, waiting for parts, cancel | Status labels only; any status can jump to any other; no history |
| 10 | Tasks & calendar | Partially working — list/create/toggle; "today/overdue" is a manual dropdown, dates are free text, no calendar view |
| — | "مسیر فروش" (sales pipeline) nav | Broken — button does nothing |
| 11 | Complaints / warranty | Missing |
| 12 | Receivables | Missing (hardcoded "۸۵ میلیون" on profile) |
| 13 | Sales performance | Missing |
| 14 | AI assistant | UI only — 3 fixed keyword replies, clearly labeled demo |
| 15 | Users & permissions | Missing ("تنظیمات و دسترسی" button does nothing; user name hardcoded) |
| 16 | Import/export/backup | Missing |
| 17 | Settings / audit log | Missing |
| — | Header search, notifications, ⌘K, many "…" buttons | UI only |

## 2. Design preservation
- Ported verbatim into this project: same markup, same class names, same CSS appended to `src/styles.css`, Vazirmatn font, RTL. Verified visually at 1280px and 390px — matches the original.
- Design uses its own CSS variables (`--navy`, `--teal`, …), not shadcn tokens. Rule: keep ATRA CSS as the source of truth; new screens reuse existing classes (`panel`, `crm-table`, `crm-form`, `status`, `tag`, `primary-button`…).

## 3. Architecture / data / security findings
- Single 600-line component → split per screen (no visual change).
- localStorage read during first render caused SSR hydration mismatch → **fixed** (load after mount, guarded writes).
- Money stored as display strings ("۴۲۰ میلیون"), dates as Persian text, task "group" stored instead of computed → cannot sum, sort or detect overdue. Needs numeric amounts (Rial/Toman integer) and real dates rendered as Jalali.
- Customer type enum (حقوقی/حقیقی/نماینده) ≠ business requirement (wholesaler / agency-store / end consumer). Needs your decision.
- Tasks reference customers by name, not id → breaks on rename.
- Order ids from `Date.now()` slice → collisions possible.
- No auth, so no security boundary at all yet. No secrets present (good).

## 4. Recommended skills (this environment)
Lovable supports workspace skills (Settings → Skills). None are required to proceed; project rules live in `AGENTS.md` + project memory. Built-in guidance already covers React/TanStack, backend, auth/roles, testing, security scanning. Recommended to add later only if you want team-wide conventions: a "Persian RTL + Jalali" skill describing date/number formatting rules.

## 5. Connectors
| Connector | Problem solved | Status | Priority |
|---|---|---|---|
| Lovable Cloud (DB, auth, storage) | Shared multi-user data, roles, backups | Available, not enabled — needs your OK | Essential now |
| Lovable AI | Real assistant, server-side, no key needed | Available after Cloud; usage-based cost | Phase 8 |
| GitHub | Version history / review | Connect from project settings (your action) | Useful |
| Figma | Design reference | Only via Lovable Desktop local MCP; current code already is the design | Optional |
| Sentry / PostHog | Error monitoring / analytics | Available as connectors | Later |
| n8n | Automations (reminders, SMS) | Available | Later |
| Mahak | Accounting read-only | No Lovable connector; no verified public API found yet — needs vendor docs or export files (Excel/CSV) | Later, needs your input |

## 6. Dependencies & testing
- Now on TanStack Start + Vite 7 + Vitest (already in project). Original had zero tests.
- Add: Jalali date library (e.g. `date-fns-jalali`), Zod for validation. Playwright is available in the sandbox for visual regression checks.

## 7. Prioritized plan
1. Split `AtraApp.tsx` into per-screen files + real URLs per page (no visual change).
2. Data model fixes: numeric money, real dates + Jalali display, ids instead of names, computed overdue.
3. Order workflow state machine with allowed transitions, history, partial delivery — with tests.
4. Enable Lovable Cloud: schema, login, roles (admin / sales manager / salesperson / production), audit log.
5. Customers + products + quotations + price approval.
6. Assembly/QC/delivery, tasks/calendar, complaints/warranty.
7. Real dashboard metrics (replace hardcoded numbers).
8. AI assistant with permission-aware read-only tools.
9. Import/export, backups, Mahak import.

## 8. Blockers needing your input
- Approve enabling Lovable Cloud (database + login).
- Customer types: replace حقوقی/حقیقی/نماینده with wholesaler / agency-store / end consumer, or keep both (legal form + channel)?
- Brand name in UI: "آتا" or "آترا"?
- Roles list and who may approve prices / cancel orders.
- Mahak version and what it can export.
- Currency unit: Toman or Rial.

## 9. Safe changes (no UI change)
Done: port, SSR-safe storage, strict type fixes, RTL `<html>`, page metadata.
Phase 2 done (see §10). Next: per-page URLs, accessibility labels on icon-only buttons, task→customer id link.

## 10. Phase 2 — low-risk engineering (2026-10-19)
**File split (no visual change).** `AtraApp.tsx` (621 lines) → `shared.tsx` (icons, header, sidebar, modal, mobile nav), `Dashboard`, `CustomerProfile`, `CustomersPage`, `OrdersPage`, `TasksPage`, `AssistantPage`, `usePersistentState.ts`; `AtraApp.tsx` keeps only app state. Markup copied verbatim. Verified: desktop (1280px, 6 screens) and phone (390px, 5 screens) screenshots are pixel-identical to the pre-change baseline.

**Order workflow** (`order-workflow.ts`, pure):
| From | Allowed next |
|---|---|
| ثبت سفارش | تأیید قیمت, لغوشده |
| تأیید قیمت | مونتاژ, لغوشده |
| مونتاژ | کنترل کیفیت, انتظار قطعه, لغوشده |
| انتظار قطعه | مونتاژ, لغوشده |
| کنترل کیفیت | آماده تحویل, مونتاژ (rework), لغوشده |
| آماده تحویل | تحویل‌شده, تحویل جزئی, لغوشده |
| تحویل جزئی | آماده تحویل, تحویل‌شده |
| تحویل‌شده / لغوشده | — (terminal) |
- Every change appends `{from,to,at}` to `order.history`; cancelling keeps the order. Invalid options are disabled in the existing status dropdown (same look) and rejected in code.

**Open questions (not decided — current behaviour shown):**
1. QC failure → back to assembly? (allowed as rework)
2. Can waiting-for-parts happen before assembly or during QC? (only from assembly)
3. Cancel after partial delivery? (blocked)
4. Reopen a cancelled order, or step back from price approval? (blocked)
5. Who may cancel / approve price? (no roles yet)

**Data-integrity fixes:** order numbers are now sequential and unique (was last 4 digits of the clock); quantity must be a whole number ≥ 1; order must reference an existing customer; saved browser data of the wrong shape is ignored instead of breaking the screen; unknown saved statuses can't be moved. Not changed (pending decisions): money as text, dates as Persian text, tasks linked by customer name.

**Checks run:** `vitest` 14/14 passed (13 new workflow tests); `tsgo` typecheck clean; preview build OK; create-order + status-change flow verified in the browser. ESLint reports only pre-existing Prettier formatting in the ported design code (left as-is to keep the code verbatim).

## 11. Stage 0–1 (2026-10-22)
- Baseline: 14/14 tests, screenshots of 5 screens desktop + phone.
- Each section has its own address; menus and browser back work; unknown addresses show the dashboard. 22/22 tests pass. After-screenshots identical to baseline except a 2×5px blinking text cursor on the assistant screen.

## 12. Stage 2 — money & dates (2026-10-25)
- Owner confirmed: all amounts are **Toman** (تومان). Nothing converted from Rial.
- New pure modules: `money.ts` (parse/format Toman; rejects «ریال» input, fractional Toman, non-numbers) and `dates.ts` (Jalali ↔ ISO via `jalaali-js`, the only dependency added; validates real Jalali dates incl. leap years).
- Data model gained optional fields only: `BatteryOrder.amountValue` (exact Toman), `BatteryOrder.deliveryDateIso` (ISO date), `CrmTask.customerId`, `CrmTask.dateIso`. Demo fixtures and all existing saved records are byte-for-byte untouched.
- Order/task forms now store the exact value + ISO date alongside the same Persian display text; new tasks link to the customer by id (renames no longer break them). Invalid amount/date input is rejected instead of saved (same silent pattern as the existing quantity check).
- Existing records NOT migrated: see docs/MIGRATION-PLAN.md (separate plan, awaits owner approval).
- Checks run: `vitest` 42/42 passed (13 new money/date tests); `tsgo` clean; preview build OK; browser-verified: new order saved with amountValue 12400000000 + deliveryDateIso, invalid amount not saved, new task saved with customerId + dateIso; desktop + phone screenshots of all screens and both forms pixel-identical to baseline.
