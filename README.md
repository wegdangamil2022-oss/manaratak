# MANARATAK 2.0 Enterprise Platform

Enterprise Monorepo

## Workspace Purpose

This monorepo serves as the single source of truth for the MANARATAK 2.0 Enterprise Platform, housing all frontend applications, backend services, and shared libraries within a unified, version-controlled workspace.

## Repository Organization

- \`/apps\`: Application endpoints (Web, API, Admin). These are the deployable units.
- \`/packages\`: Shared modules based on Clean Architecture (Core, Shared, Domain, Application, Infrastructure, UI, Config, Types, Utils).
- \`/tools\`: Build and operational tools.
- \`/docs\`: Architectural documentation.
- \`/config\`: Shared configurations.
- \`/scripts\`: Automation scripts.

## Package Responsibilities & Dependency Matrix

The monorepo strictly enforces Clean Architecture. Dependencies must point inwards toward the Domain.

**Dependency Flow (Inner to Outer):**

1. **Domain** (\`@manaratak/domain\`): Enterprise business rules. _Depends on: None._
2. **Application** (\`@manaratak/application\`): Application use cases. _Depends on: Domain._
3. **Infrastructure** (\`@manaratak/infrastructure\`): External agencies (DB, Auth). _Depends on: Application, Domain._
4. **Applications** (\`@manaratak/web\`, \`@manaratak/api\`, \`@manaratak/admin\`): Delivery mechanisms. _Depends on: Infrastructure, Application, Domain, UI._

**Cross-Cutting Packages:**

- \`@manaratak/core\`: Foundational interfaces.
- \`@manaratak/shared\`: Domain-agnostic utilities.
- \`@manaratak/types\`: Global type definitions.
- \`@manaratak/utils\`: Helper functions.
- \`@manaratak/config\`: Shared configurations.
- \`@manaratak/ui\`: Shared UI components.

## Architecture Boundaries (Public API)

Every package must expose ONLY its public entry point (\`src/index.ts\`).
Internal folders must never be imported directly by other packages.

- **Allowed:** \`import { Something } from '@manaratak/domain';\`
- **Forbidden:** \`import { Something } from '@manaratak/domain/src/internal/Something';\`

## Contribution Principles

1. **No Circular Dependencies:** Strictly forbidden.
2. **Workspace References:** All internal packages MUST be linked using workspace references (e.g., \`"workspace:_"\` or \`"_"\`). No relative paths (\`../packages/...\`).
3. **Consistent Naming:** All packages must be scoped under \`@manaratak/\`.
4. **Implementation First:** Follow the approved architectural blueprints. No unapproved structural changes.

## Development Environment Governance

- **Centralized Configuration:** All workspace tooling (TypeScript, ESLint, Prettier, environment loading, and scripts) inherits from the root configuration files.
- **Package-Level Configuration:** Package-level configurations (`tsconfig.json`) must ONLY extend the root configuration (`tsconfig.base.json`). Duplicate configurations (e.g., package-level `.prettierrc` or `eslint.config.js`) are strictly forbidden.

## Environment Variable Governance

- **Strict Configuration Boundary:** Environment variables must enter the system ONLY through the Configuration layer (`@manaratak/config`) and application endpoints (`apps/*`).
- **Forbidden Access:** Shared packages, domain, application, and infrastructure layers MUST NEVER read environment variables directly (no `process.env` or `import.meta.env`).
- **Application Responsibility:** Every application is responsible for loading its own environment variables and injecting them into the shared layers via configuration interfaces.

### Environment Setup & Reference

The application features smart, safe fallbacks in non-production environments to ensure the development server and Google Studio hosted previews boot seamlessly without manual intervention.

| Environment Variable | Required | Default Fallback / Safe Development Value | Description |
| :--- | :--- | :--- | :--- |
| **`JWT_SECRET`** | **Yes** (Length $\ge$ 32) | `manaratak-local-development-jwt-secret-2026` | Token signing secret. Validation fails in non-test runtimes if fewer than 32 characters. |
| **`ADMIN_AUTH_MODE`** | No | `demo` | Set to `strict` in production to enforce strict bearer authentication. |
| **`ADMIN_BEARER_TOKEN`** | No | `admin-demo-bearer-token-must-be-at-least-32-chars` | Required only when `ADMIN_AUTH_MODE=strict`. Must be $\ge$ 32 characters. |
| **`DATABASE_URL`** | No | `file:./dev.db` | Connection string for SQLite database. |
| **`REDIS_URL`** | No | `redis://localhost:6379` | Connection string for Redis. |
| **`VITE_ADMIN_URL`** | No | `http://localhost:3001` | Local fallback URL of the Admin Portal. In Google Studio hosted preview, keep empty or use `/admin` for same-origin mounting. |
| **`VITE_API_URL`** | No | `/api/v1` | Public API base path override. |

#### Google Studio Hosted Preview Setup
Inside Google Studio, standard environment variables are pre-filled or can be supplied in the Settings tab. To set a custom `JWT_SECRET`, input a secure, high-entropy string containing at least 32 characters (e.g. `manaratak-local-development-jwt-secret-2026`).

## Local Verification & Demo Data

Use the following commands for safe local verification:

- `npm run verify:local`: Runs build and tests. (Note: lint and typecheck strict gates are intentionally deferred to Phase 04. Phase 04 will make stricter static analysis gates green before promoting them into mandatory verification.)
- `npm run seed:demo:dry-run`: (Optional developer command) Prints the deterministic demo seed plan without requiring a database.
- `npm run seed:demo`: (Optional developer command) Writes demo records to the configured `DATABASE_URL`; use only against a local or disposable development database.

The demo seed is non-production data for reviewing public and admin surfaces across scholarships, universities, majors, courses, CMS, services, careers, international tests, tools, and certificate templates.

## i18n Guidelines (Bilingual Support)
MANARATAK 2.0 supports bilingual interfaces (Arabic as default, English as secondary) for the public web app, and English as default for the Admin app.

### Usage in Components:
To add translations to new pages or components, follow these guidelines:

1. **Do not use hardcoded strings** in the UI.
2. Add your new strings to both `ar.ts` and `en.ts` inside the `src/i18n` folder of the respective application (`apps/web` or `apps/admin`).
3. Use the `useTranslation` hook inside your components:
   ```tsx
   import { useTranslation } from '../i18n/I18nProvider';

   const MyComponent = () => {
     const { t } = useTranslation();
     return <h1>{t('my_new_key')}</h1>;
   };
   ```
4. **RTL / LTR**: The `I18nProvider` automatically sets `document.documentElement.dir` to `rtl` for Arabic and `ltr` for English, so Tailwind's logical properties (e.g., `ms-4`, `pe-2`) will automatically flip directions.

## Admin Portal
The Admin Portal is a separate React application designed to manage the MANARATAK 2.0 platform.
- **Local Development URL:** Run the Admin Portal using `npm run dev -w @manaratak/admin`. It will be served at `http://localhost:3001`.
- **Google Studio Preview:** In Google Studio preview, secondary ports are not directly accessible. The application provides an interactive same-origin Admin Preview Shell at `/admin` covering all 17 Phase 23 admin sections (Dashboard, Review Queue, Import Management, Scholarships, Universities, Majors, International Tests, Courses, Services, CMS, Student Tools, Certificates, Finance, Careers, AI Governance, Health/Readiness, and Settings).
- **Demo Credential (Development-Only):** You can use the local demo admin credential `wegdangamil2022@gmail.com` with password `wegdan1234@1234` on the public login page to automatically unlock the local dashboard. In production, a secure 32+ character bearer token is strictly required.
- **Configuring VITE_ADMIN_URL:** To link the public application to a deployed instance of the Admin Portal (e.g., in production or staging), set `VITE_ADMIN_URL` (e.g., `https://admin.manaratak.example.com`). If set, the public app will redirect admin users to this URL.
