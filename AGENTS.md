<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## ATRA project rules
- The ATRA UI ported from Figma Make (`src/components/atra/`, ATRA section of `src/styles.css`) is the approved design; reuse its CSS classes and variables for new screens instead of shadcn defaults, because visual identity must not drift.
- Demo fixtures live in `src/components/atra/crm-data.ts` and must stay clearly labeled demo; never present them as real business metrics.
- Browser storage must be read after mount (never in render/initializers) to avoid SSR hydration mismatches.
- Each ATRA screen lives in its own file under `src/components/atra/`; `AtraApp.tsx` only holds app state and wiring, so screens can change independently.
- Order status changes go through the pure `order-workflow.ts` (allowed-transition table + append-only history), so rules are testable and never bypassed by the UI.
- `AtraApp` is mounted once in `__root.tsx` and picks the screen from the URL via pure `atra-paths.ts`; leaf route files only provide address + head(), so state and saved data survive page changes.
- Money and dates go through the pure `money.ts` (Toman) and `dates.ts` (Jalali↔ISO) modules; new records store the exact value next to the Persian display text, existing records stay untouched until the approved migration (docs/MIGRATION-PLAN.md).
- The migration preview (`migration-preview.ts` pure logic + `MigrationPreview.tsx` at the hidden address /migration-preview) is strictly read-only: it receives app state as props and must never call setters or storage, so a report can never mutate data.
