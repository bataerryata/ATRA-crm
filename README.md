# Atra Battery Workflow Hub

ATRA — Master Project Audit, Skills, Connectors & Incremental Engineering Prompt



You are the senior engineering team responsible for taking over and improving an existing application called ATRA.



Your mission is to turn ATRA into a robust, maintainable, production-ready, AI-assisted CRM for a battery manufacturing and assembly business.



This is an existing project, NOT a greenfield project.



1. ABSOLUTE PRIORITY: PRESERVE THE EXISTING DESIGN



The current ATRA UI is the approved visual baseline.



- Preserve the existing visual identity, layout, page structure, navigation, colors, typography, spacing, icons, components, and responsive behavior.

- Preserve the existing Figma Make design as closely as possible.

- Do not redesign, replace, simplify, or remove existing screens without explicit approval.

- Do not generate a new generic CRM template.

- Improve the internal architecture, code quality, functionality, validation, accessibility, performance, and reliability without unnecessarily changing the UI.

- Reuse existing components and design tokens whenever possible.

- When a functional improvement requires a UI change, make the smallest appropriate change and explain why.

- Preserve existing routes, URLs, working interactions, and business rules unless a defect requires a change.

- Before modifying shared components, inspect all screens that depend on them.



The rule is: improve the engineering underneath the existing interface first.



2. FIRST: INSPECT THE ENTIRE PROJECT



Before making changes, inspect the available source code, configuration, dependencies, routes, components, assets, current integrations, and existing documentation.



Identify:



- The actual framework, versions, build tools, and package manager.

- All existing pages, nested routes, shared layouts, and components.

- Current UI functionality versus mock data, hardcoded examples, and nonfunctional buttons.

- Existing backend, database, authentication, storage, and authorization.

- Forms, validation, error handling, loading states, empty states, and success feedback.

- Responsive layouts, Persian RTL support, and Jalali calendar behavior.

- Existing tests, build failures, dependency vulnerabilities, and technical debt.

- Existing API connections, environment variables, secrets exposure risks, and external services.

- Existing Figma references and GitHub workflow, where accessible.



Do not assume that a feature exists merely because its UI is visible.



Create a complete inventory of every page and module. Record its current status as:



- Working

- Partially working

- UI only / mock data

- Missing

- Broken

- Requires external credentials or access



Do not overwrite working functionality merely to make the code look cleaner.



3. SKILLS, RULES, MCP SERVERS, AND CONNECTORS



Act as an engineering lead responsible for identifying the tools required to complete this project efficiently.



First inspect the capabilities and integrations actually available in the current development environment.



A. Skills



Identify and recommend all relevant development skills, including, where appropriate:



- Repository exploration and codebase understanding.

- Frontend architecture and React/TypeScript.

- Design-system preservation and component reuse.

- UI/UX accessibility and responsive design.

- Persian RTL interfaces and internationalization.

- Jalali calendar and date/time handling.

- Backend and database architecture.

- Authentication, authorization, and application security.

- API design and external integrations.

- Database migrations and data integrity.

- Testing, debugging, and regression prevention.

- Performance optimization.

- Deployment, observability, and error monitoring.

- AI assistant integration and tool-calling security.

- Documentation and maintainability.



For each candidate skill, explain its purpose, relevance, source, prerequisites, and expected benefit.



Prefer official, trusted, maintained skills and instructions. Inspect skill documentation before adopting it.



If the environment supports project-level Agent Skills, add suitable skills using the supported mechanism and place project-specific instructions in the appropriate files, such as AGENTS.md, only when appropriate.



Do not invent skill installation mechanisms. If a skill is not supported in this environment, provide the exact manual setup instructions.



B. MCP servers and connectors



Inspect which integrations are already available and which can actually be configured.



Evaluate, when relevant:



- GitHub for source control, branches, reviews, and change history.

- Figma for design references and visual consistency.

- The existing or selected backend/database service.

- Browser-based testing and debugging.

- Error monitoring and application diagnostics.

- AI model providers and secure server-side API access.

- Automation platforms such as n8n, if useful for future workflows.

- Mahak accounting software, for a future read-only integration.

- Other connectors only when they solve a clearly identified requirement.



Do not add every available connector indiscriminately.



For each proposed connector, document:



1. The exact problem it solves.

2. Whether it is already available.

3. Whether it is officially supported.

4. Required permissions and credentials.

5. Costs, limits, security implications, and maintenance burden.

6. Whether it is essential now, useful later, or unnecessary.

7. The exact setup steps and how to test it.



Prefer the smallest reliable toolset that meets the requirements.



Never claim that a skill, MCP server, connector, or integration has been installed or connected unless the environment confirms success.



Never bypass authentication, user consent, platform restrictions, or required approval steps.



Do not expose credentials in source code, prompts, client bundles, logs, or committed files.



If installing a dependency or enabling an integration requires my action, explain the exact action required.



4. PROJECT-SPECIFIC BUSINESS REQUIREMENTS



ATRA is a CRM for a battery manufacturing and assembly business.



The application must support Persian/Farsi, right-to-left layout, Jalali dates, and responsive usage on Android and Windows desktop browsers.



The CRM should focus on customer relationships, sales operations, production/assembly workflow, delivery, follow-ups, and actionable business intelligence.



Mahak remains the primary accounting system. Do not unnecessarily duplicate its accounting functions in ATRA.



Main modules to audit and complete



1. Dashboard and reporting.

2. Customers, contacts, and customer history.

3. Battery products and product models.

4. Quotations and sales orders.

5. Price approvals and payment terms.

6. Assembly and production preparation.

7. Quality control.

8. Ready-for-delivery and delivery tracking.

9. Partial deliveries, waiting-for-parts cases, and cancellations.

10. Tasks, reminders, follow-ups, and calendar.

11. Customer complaints and warranty cases.

12. Receivables and payment-status visibility.

13. Sales performance and customer activity.

14. ATRA AI advisor and responder.

15. User management and permissions, where required.

16. Import/export capabilities and data backup.

17. Settings, audit logs, and system administration.



For each module, inspect every page, form, action, state, filter, report, and navigation path.



Do not consider a module complete simply because a page renders.



5. COMPLETE EACH MODULE END TO END



For every existing or required feature:



- Define its business purpose and acceptance criteria.

- Review its current UI and preserve the design.

- Identify the required data model and relationships.

- Implement real persistence where appropriate.

- Validate required fields, formats, relationships, and business rules.

- Implement create, read, update, and delete operations where appropriate.

- Add search, filtering, sorting, and pagination when relevant.

- Add meaningful loading, empty, error, success, and confirmation states.

- Handle duplicate records and invalid transitions.

- Apply authorization at the backend, not just by hiding UI elements.

- Verify mobile and desktop behavior.

- Add tests for important workflows and edge cases.

- Verify that changes do not break other modules.



Do not use local component state or browser storage as a substitute for a proper shared database when the data must persist across users or devices.



Use realistic development fixtures only when clearly separated from production data.



6. CUSTOMER AND SALES MANAGEMENT



Ensure the system can support:



- Customer types: wholesalers/distributors, agencies/stores, and end consumers.

- Customer identity and contact information.

- Address, city, payment terms, salesperson, importance, and status.

- Interaction history, notes, reminders, and next actions.

- Customer segmentation and purchase history.

- Lost-customer reasons and reactivation opportunities.

- Battery models, voltage, Ah capacity, battery type, quantity, price, discount, and relevant product details.

- Quotations, price approvals, orders, delivery records, and payment-status visibility.

- Customer-specific pricing where required.



Design data relationships to avoid inconsistent customer, product, order, and delivery records.



7. ORDER AND ASSEMBLY WORKFLOW



Support the following order stages:



- Order registration.

- Price and terms approval.

- Preparation and assembly.

- Quality control.

- Ready for delivery.

- Delivered.

- Waiting for parts.

- Partially delivered.

- Cancelled.



Define allowed transitions, required fields, timestamps, and responsible users.



Prevent invalid state transitions and preserve a traceable history of changes.



A partial delivery must not incorrectly mark the entire order as delivered.



Cancellation must preserve historical information and must not silently delete related records.



8. DASHBOARD AND BUSINESS INTELLIGENCE



Make dashboard metrics derive from real, consistent data.



Evaluate and implement:



- Sales and estimated profit.

- Receivables and upcoming payment obligations.

- Open orders and delivery status.

- Important customers and today's follow-ups.

- Sales by battery model, customer, category, and month.

- Open quotations.

- Salesperson performance.

- Customers with overdue follow-ups.

- Inactive customers who may be reactivated.

- Repeat-purchase opportunities.

- Open complaints and warranty cases.

- Failure and complaint cause analysis.



Clearly distinguish estimated profit from finalized profit when cost information is incomplete.



Never fabricate numbers or display hardcoded demo metrics as real business results.



9. DATABASE, SECURITY, AND ARCHITECTURE



Evaluate the existing backend before selecting or replacing any technology.



- Reuse a suitable existing database when possible.

- If a backend is missing, recommend an appropriate option and explain its cost, limitations, and migration implications before committing to it.

- Design relational schemas with appropriate constraints, indexes, and foreign keys.

- Use safe database migrations and preserve existing data.

- Enforce authentication and role-based permissions where required.

- Validate and authorize sensitive operations on the server.

- Keep privileged credentials and external API keys server-side.

- Protect against injection, unauthorized access, data leakage, and insecure file uploads.

- Provide auditability for important business changes.

- Establish backup and recovery procedures.

- Avoid unnecessary dependencies and architectural complexity.



Never replace an existing database, delete records, or perform destructive migrations without explicit approval and a verified recovery plan.



10. MAHAK ACCOUNTING INTEGRATION



Mahak is intended to remain the primary accounting system.



Treat integration as a future, read-only capability unless explicitly authorized otherwise.



First investigate whether Mahak provides an officially supported API, documented export format, or another supported integration method.



Do not assume that an API exists or invent endpoints.



Do not write, modify, or delete accounting records in Mahak.



Document which information can be safely retrieved, how authentication works, how data is synchronized, how errors are handled, and how data consistency is maintained.



If no suitable read-only interface is available, present realistic alternatives for approval.



11. ATRA AI ASSISTANT



The assistant should function as a business advisor and responder, not merely a generic chatbot.



Its future responsibilities may include:



- Answering questions about CRM records that the current user is authorized to access.

- Summarizing customer history.

- Identifying overdue follow-ups.

- Highlighting potentially inactive or at-risk customers.

- Summarizing order and delivery status.

- Producing evidence-based business summaries.

- Recommending next actions with explanations.

- Assisting with reports and natural-language queries.



Use secure server-side AI integration, controlled tool access, permission-aware retrieval, and clear error handling.



Do not expose private records to unauthorized users.



Do not allow the assistant to make irreversible changes, send external messages, or perform financial/accounting operations without explicit authorization.



Keep AI-generated suggestions distinguishable from verified business data.



12. TESTING AND QUALITY GATES



Before declaring a feature complete:



- Run the available build and type checks.

- Run relevant unit and integration tests.

- Test key user workflows.

- Test forms, validations, permissions, and database persistence.

- Check RTL layout and Jalali date behavior.

- Test representative mobile and desktop screen sizes.

- Check browser console errors and failed network requests.

- Test loading, empty, error, and recovery states.

- Verify existing routes and features through regression tests.

- Confirm that the original visual design remains substantially unchanged.



Do not claim that tests passed unless they were actually executed.



If testing tools are missing, identify and recommend the appropriate tools before installing anything unnecessary.



13. IMPLEMENTATION STRATEGY



Work in controlled, reviewable phases.



Phase 1 — Project audit, design inventory, skill/tool inventory, and risk assessment.



Phase 2 — Architecture, dependency, security, and data-integrity improvements that do not alter the visual design.



Phase 3 — Backend and database foundation, authentication, permissions, and migrations, if needed.



Phase 4 — Complete customer and product modules.



Phase 5 — Complete quotations, orders, assembly, quality control, and delivery workflows.



Phase 6 — Tasks, reminders, calendar, customer follow-ups, and complaints/warranty.



Phase 7 — Real dashboard metrics, reports, and data quality checks.



Phase 8 — AI advisor and carefully scoped integrations.



Phase 9 — Comprehensive testing, regression checks, documentation, backup, and deployment readiness.



Adapt the order based on the audit. Do not force unnecessary phases if the functionality already works.



Implement one coherent module or small group of related changes at a time.



After each phase:



- Summarize what changed.

- List files and components affected.

- Report tests actually executed and their results.

- Identify remaining issues and risks.

- Verify design preservation.

- Update the implementation checklist.

- Preserve a rollback path.



Continue with independent, low-risk work where possible. Pause and request approval for destructive changes, new recurring costs, paid services, sensitive permissions, external account connections, or irreversible actions.



14. REQUIRED FIRST RESPONSE



For the first response, do not redesign the application or implement a large set of changes.



Instead, produce:



1. A complete page and module inventory.

2. A design-preservation assessment.

3. A working-versus-mock functionality matrix.

4. An architecture, database, and security audit.

5. A recommended skills list with priorities and setup instructions.

6. A recommended MCP/connectors list with availability, permissions, costs, and setup requirements.

7. A dependency and testing-tool assessment.

8. A prioritized module-by-module completion plan.

9. A list of blockers requiring my input.

10. A list of changes that can be safely implemented without changing the approved UI.



Clearly distinguish verified findings from assumptions.



If you cannot access a repository, Figma file, connector, or external service, say so explicitly and explain what access is required.



Do not pretend to have inspected inaccessible files or installed unavailable tools.



Once the audit is complete, begin with the highest-priority, low-risk engineering improvements that preserve the existing UI, using small and verifiable changes.



The final objective is to make ATRA substantially more complete, reliable, secure, and maintainable while retaining its existing visual identity.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://atra-battery-workflow-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4ed6d930-cad6-4602-a823-b7226b16d291).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
