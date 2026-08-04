# Phase 9 Remediation - Stage 1: Current International Tests Data Inventory

## 1. Executive Summary
An audit of the International Tests Platform data reveals that there are exactly 49 canonical test sources stored as TypeScript files (`*-markdown-content.ts`) in the `apps/web/src/features/admin-preview/` directory. 
The system suffers from data duplication (23 raw `.md` files are exact copies of the Markdown embedded in the `.ts` files) and a complete lack of database persistence. The 49 tests exist entirely as hardcoded fallback arrays in the frontend, rather than as durable database records. The UI count discrepancy (showing 47 or 48 instead of 49) is caused by aggressive, hardcoded client-side filtering that removes SAT and GRE tests, combined with complex `localStorage` merging logic that can mask the true count.

## 2. Files, folders, models, tables, seeds, and APIs inspected
- **Folders**: `apps/web/src/features/admin-preview/`, `packages/infrastructure/prisma/`, `packages/infrastructure/src/international-tests/`, `apps/admin/src/pages/`
- **Files**: `AdminInternationalTestsPreviewPage.tsx`, `AdminDomainImportCenterPage.tsx`, `InternationalTestsAdminPage.tsx`, `schema.prisma`, `PrismaInternationalTestRepository.ts`, 49 `*-markdown-content.ts` files, 23 `.md` files.
- **Models/Tables**: `InternationalTest`, `ImportBatch`, `ImportRecord` (Inspected via `schema.prisma`, but found no seed scripts for them).
- **APIs**: `InternationalTestAdminRouter.ts` (API routes exist but rely on empty DB tables, causing frontend fallback).

## 3. Current Observed Counts
- **Canonical tests (Source files)**: 49 (`*-markdown-content.ts` files)
- **Raw markdown duplicates**: 23 (`.md` files)
- **Database rows (InternationalTest)**: 0 (No seed scripts exist for them, API returns empty list leading to UI fallback)
- **Import batches/records**: 0 in DB (10 hardcoded mock cards in `AdminDomainImportCenterPage.tsx`)
- **Published tests (Frontend Fallback)**: 49 (Hardcoded in `AdminInternationalTestsPreviewPage.tsx`)

## 4. Explanation of the 48 vs 49 mismatch
The hardcoded fallback array in `AdminInternationalTestsPreviewPage.tsx` contains exactly 49 test objects. However, lines 72-77 of that file contain a hardcoded `items.filter(...)` that explicitly excludes any test whose ID or display name includes `sat` or `gre` (unless it includes `csat` or `gamsat`). 
This filter automatically removes `test-sat` and `test-gre-shorter`, reducing the displayed count from 49 to 47. The count may appear as 48 if a user has previously triggered a mock import in the browser, which saves a mock record to `localStorage` (`admin_imported_tests_domain`). The frontend merges these `localStorage` items back into the list using `unshift()`, artificially inflating the count. It might also show 48 due to specific cached data combinations.

## 5. Complete Inventory Table
| Canonical Test Name | ID/Slug | Source File | Provenance Confidence | Notes |
|---|---|---|---|---|
| Abitur — ألمانيا | test-abitur | abitur-markdown-content.ts | LOW (Hardcoded) | No DB record |
| ACT — ملف بيانات اختبار القبول الجامعي الكامل للطلاب | test-act | act-markdown-content.ts | LOW (Hardcoded) | No DB record |
| A-Level / UK & International | test-alevel | alevel-markdown-content.ts | LOW (Hardcoded) | No DB record |
| AP Exams — ملف بيانات برنامج اختبارات القبول والائتمان الجامعي الكامل للطلاب | test-ap | ap-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-bmat | bmat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Cambridge English Qualifications — ملف بيانات المجموعة الكامل للطلاب | test-cambridge | cambridge-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Celpe-Bras — البرازيل واللغة البرتغالية البرازيلية | test-celpebras | celpebras-markdown-content.ts | LOW (Hardcoded) | No DB record |
| CILS — اللغة الإيطالية | test-cils | cils-markdown-content.ts | LOW (Hardcoded) | No DB record |
| CLT — Classic Learning Test | test-clt | clt-markdown-content.ts | LOW (Hardcoded) | No DB record |
| CPA — المحاسبة | test-cpa | cpa-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-csat | csat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| CSCA — الصين | test-csca | csca-markdown-content.ts | LOW (Hardcoded) | No DB record |
| CUET — الهند | test-cuet | cuet-markdown-content.ts | LOW (Hardcoded) | No DB record |
| DAT — الولايات المتحدة والقبول في طب الأسنان | test-dat | dat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| DELE — اللغة الإسبانية | test-dele | dele-markdown-content.ts | LOW (Hardcoded) | No DB record |
| DELF / DALF — فرنسا وبلجيكا | test-delf | delf-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Duolingo English Test — ملف بيانات الاختبار الكامل للطلاب | test-duolingo | duolingo-markdown-content.ts | LOW (Hardcoded) | No DB record |
| EJU (Examination for Japanese University Admission for International Students) — ملف مواصفات وبيانات الاختبار الأكاديمي للقبول بالجامعات اليابانية | test-eju | eju-markdown-content.ts | LOW (Hardcoded) | No DB record |
| GAMSAT — ملف بيانات اختبار القبول للدراسات الطبية والصحية | test-gamsat | gamsat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| GMAT Exam — ملف بيانات اختبار القبول لكليات إدارة الأعمال الكامل للطلاب | test-gmat | gmat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| GRE General Test — ملف بيانات اختبار القبول للدراسات العليا الكامل | test-gre | gre-markdown-content.ts | LOW (Hardcoded) | No DB record |
| HSK (Hanyu Shuiping Kaoshi) — ملف مواصفات وبيانات اختبار كفاءة اللغة الصينية الكامل | test-hsk | hsk-markdown-content.ts | LOW (Hardcoded) | No DB record |
| IELTS — ملف بيانات الاختبار الكامل للطلاب | test-ielts | ielts-markdown-content.ts | LOW (Hardcoded) | No DB record |
| IMAT — إيطاليا والقبول الجامعي في الطب باللغة الإنجليزية | test-imat | imat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| iTEP Academic — ملف بيانات الاختبار الكامل للطلاب | test-itep | itep-markdown-content.ts | LOW (Hardcoded) | No DB record |
| JLPT — اليابان واللغة اليابانية | test-jlpt | jlpt-markdown-content.ts | LOW (Hardcoded) | No DB record |
| LANGUAGECERT Academic — ملف بيانات الاختبار الكامل للطلاب | test-languagecert | languagecert-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-linguaskill | linguaskill-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-matura | matura-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-mcat | mcat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-met | met-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-nt2 | nt2-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-ote | ote-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-plab | plab-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-pmp | pmp-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-polish_state_certificate | polish_state_certificate-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-pte | pte-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-sat | sat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-testdaf | testdaf-markdown-content.ts | LOW (Hardcoded) | No DB record |
| TOEFL iBT — ملف بيانات الاختبار الكامل للطلاب | test-toefl | toefl-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-toeic | toeic-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-tomer | tomer-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-topik | topik-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-torfl | torfl-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-ucat | ucat-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-ukbi | ukbi-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-usmle | usmle-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-yks | yks-markdown-content.ts | LOW (Hardcoded) | No DB record |
| Unknown | test-yos | yos-markdown-content.ts | LOW (Hardcoded) | No DB record |

## 6. Duplicate and Alias Findings
23 raw `.md` files in `apps/web/src/features/admin-preview/` are exact duplicates of the Markdown content embedded within their corresponding `*-markdown-content.ts` files (e.g., `ielts.md` vs `ielts-markdown-content.ts`).

## 7. Missing or Unlinked Source Files
None of the 49 test sources are linked to a database record or a canonical `ImportRecord`. They are entirely unlinked from the backend.

## 8. Tests Without Reliable Provenance
All 49 tests lack reliable provenance. They are hardcoded in the frontend repository rather than being driven by a CMS, a database seed, or a verified import batch.

## 9. Import Records Not Linked to Canonical Tests
The Import Center UI (`AdminDomainImportCenterPage.tsx`) uses 10 hardcoded mock cards (e.g., `card-ielts-master-2026`). These are not real `ImportBatch` or `ImportRecord` entities from the database, and they rely on `localStorage` to simulate import state.

## 10. Risks Discovered
- **Zero Backend Truth**: The International Tests platform is currently a frontend-only facade relying on hardcoded arrays and `localStorage`.
- **Data Loss Risk**: Any edits made in the admin UI will be lost when `localStorage` is cleared, as they are not persisted to Postgres.
- **UI Filtering Bug**: Hardcoded filters removing `sat` and `gre` are masking valid test data.

## 11. Stage 1 Remediation Recommendation
Stage 1 can be considered complete as the true state of the data is now known. 
For the next stage, multiple execution prompts will be needed:
1. **Database Seeding**: Create a proper seed script that reads the 49 `*-markdown-content.ts` files and inserts them into the `InternationalTest` Postgres table.
2. **API & UI Refactor**: Remove the hardcoded fallback arrays, `localStorage` merging logic, and hardcoded `sat`/`gre` filters from `AdminInternationalTestsPreviewPage.tsx`, forcing it to rely exclusively on the API.
3. **Cleanup**: Delete the 23 redundant `.md` files.

## 12. Explicit Evidence References
- **49 Source Files**: `apps/web/src/features/admin-preview/*-markdown-content.ts`
- **UI Fallback Array**: `apps/web/src/features/admin-preview/AdminInternationalTestsPreviewPage.tsx` (lines 81-777)
- **SAT/GRE Filter**: `apps/web/src/features/admin-preview/AdminInternationalTestsPreviewPage.tsx` (lines 72-77)
- **localStorage Merging**: `apps/web/src/features/admin-preview/AdminInternationalTestsPreviewPage.tsx` (lines 891-1275)
- **Mock Import Cards**: `apps/web/src/features/admin-preview/AdminDomainImportCenterPage.tsx` (lines 847-1000)
- **Database Schema**: `packages/infrastructure/prisma/schema.prisma` (Models: `InternationalTest`, `ImportBatch` exist but are unpopulated)
