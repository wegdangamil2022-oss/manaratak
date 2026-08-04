import re

filepath = 'docs/phases/phase-23-enterprise-administration-portal/phase-23-04-admin-preview-ui-design-and-action-backlog.md'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of section 22
match = re.search(r'## 22\. International Tests Admin Workspace \(Phase 09\)', content)
if not match:
    print("Could not find section 22")
    exit(1)

start_index = match.start()

new_section = """## 22. International Tests Admin Workspace (Phase 09)

Phase 09 owns the foundational metadata, scoring structures, and requirements for International Tests and standardized exams (e.g., IELTS, TOEFL, SAT, GMAT). It acts as the central registry for tests which downstream phases (Universities, Scholarships) will reference. 

**Important Base Rule:**
Every piece of information that appears on the public student-facing test page must first have a place in the admin control panel. It will not appear to students until it is explicitly approved and published.

**Paths & Routes:**
- `/admin/international-tests`
- `/admin/international-tests/:id`
- `/admin/imports/international-tests`

### 22.1 Unified International Test Profile

#### A. Test Page Header / رأس ملف الاختبار
- Test Name (Arabic/English) / اسم الاختبار عربي/إنجليزي
- Official Abbreviation / الاختصار الرسمي
- Test Category / نوع الاختبار
- Official Provider / المزود الرسمي
- Delivery Mode / طريقة التقديم
- Score Scale Range / نطاق الدرجة
- Availability Status / حالة التوفر
- Last Source Verification Date / آخر تحقق من المصدر
- Source Trust Level / مستوى ثقة المصدر
- Public Preview Link (only visible after PUBLISHED) / رابط المعاينة العامة بعد النشر فقط

#### B. Description & Use Cases / الوصف والاستخدامات
- Introductory Brief / نبذة تعريفية
- Test Purpose/Benefit / فائدة الاختبار
- Who Needs It / من يحتاجه
- Use Cases: University Admission, Scholarships, Language Proof, Professional Licensing, Immigration / الاستخدامات: قبول جامعي، منح، إثبات لغة، ترخيص مهني، هجرة
- Target Audience / الجمهور المستهدف
- Commonly Used Countries/Regions / الدول أو المناطق التي يستخدم فيها غالبًا
- Associated Languages / اللغات المرتبطة

#### C. Versions & Delivery Modes / النسخ وطريقة التقديم
- Variant Name / اسم النسخة
- Variant Description / وصف النسخة
- Delivery Mode / طريقة التقديم
- Active Status / حالة النشاط
- Variant-Specific Official URL / رابط رسمي خاص بالنسخة
- Administrative Notes on differences between variants / ملاحظات الفرق بين النسخ

#### D. Test Sections / أقسام الاختبار
- Section Name / اسم القسم
- Section Type / نوع القسم
- Duration / المدة
- Order / الترتيب
- Question Types / أنواع الأسئلة
- Number of Questions (if applicable) / عدد الأسئلة إن وجد
- Section Score (Min/Max) / درجة القسم من/إلى
- Total Test Duration / إجمالي مدة الاختبار
- Breaks (if applicable) / فترات الراحة إن وجدت

#### E. Score Scale & Equivalencies / نظام الدرجات والمعادلات
- Minimum and Maximum Score / الدرجة الدنيا والعليا
- Score Increment / معدل الزيادة
- Section Scores / درجات الأقسام
- Bands / Levels 
- Pass/Fail Rules / قواعد النجاح والرسوب
- CEFR Mapping 
- Equivalencies to other tests (e.g., IELTS vs TOEFL) / معادلات اختبارات أخرى مثل IELTS مقابل TOEFL
- Result Release Duration / مدة ظهور النتيجة
- Result Validity Period / مدة صلاحية النتيجة
- Methods for sending results to universities / طريقة إرسال النتائج للجامعات
- Score Reporting / Sending URL / رابط إرسال/تقرير الدرجات

#### F. Fees & Financial Policies / الرسوم والسياسات المالية
- Registration Fee / رسوم التسجيل
- Currency / العملة
- Regional Price Variation / اختلاف السعر حسب الدولة
- Late Registration Fee / رسوم التسجيل المتأخر
- Rescheduling Fee / رسوم تغيير الموعد
- Cancellation Fee / رسوم الإلغاء
- Price Validity Window / Last Price Update / مدة صلاحية السعر أو آخر تحديث للسعر
- **Disclaimer:** Phase 09 stores descriptive fee metadata only; actual payment execution is handled in Phase 19. / تنبيه واضح: Phase 09 يخزن رسوم وصفية فقط، والدفع الفعلي يخص Phase 19

#### G. Requirements & Policies / المتطلبات والسياسات
- Registration Requirements / متطلبات التسجيل
- ID / Passport Requirements / متطلبات الهوية أو الجواز
- Age Restrictions / قيود العمر
- Retake Policy / سياسة إعادة الاختبار
- Cancellation Policy / سياسة الإلغاء
- Rescheduling Policy / سياسة تغيير الموعد
- Special Needs Accommodations / تسهيلات ذوي الاحتياجات
- Test Day Conditions / شروط يوم الاختبار

#### H. Availability & Test Centers / التوفر ومراكز الاختبار
- Available Countries / الدول المتاحة
- Available Cities / المدن المتاحة
- Authorized Test Centers / مراكز الاختبار المعتمدة
- Online Availability / التوفر أونلاين
- Online Availability Regions / مناطق التوفر أونلاين
- Testing Windows / Sessions 
- Nearest Test Center (future calculation based on student location) / أقرب مركز اختبار لاحقًا حسب موقع الطالب
- **Rule:** Countries, cities, currencies, and languages are pulled from Phase 07 and must not be duplicated in Phase 09. / قاعدة: الدول والمدن والعملات واللغات تأتي من Phase 07 ولا تكرر داخل Phase 09

#### I. Official Links & Verification / الروابط الرسمية والتحقق
- Official Registration URL / رابط التسجيل الرسمي
- Official Test Information URL / رابط معلومات الاختبار
- Official Preparation URL / رابط التحضير الرسمي
- Score Reporting URL / رابط إرسال النتائج
- Source Name / اسم المصدر
- Source Type / نوع المصدر
- Last Verification Date / آخر تاريخ تحقق
- Link Status / حالة الرابط
- Source or Link Trust Level / مستوى ثقة الرابط أو المصدر

#### J. Preparation Materials & Assets / مواد التحضير والأصول
- Practice Tests / اختبارات تجريبية
- Sample Questions / أسئلة نموذجية
- PDF Files / Brochures / ملفات PDF / brochures
- Audio Samples / عينات صوتية
- Preparation Guides / أدلة تحضير
- Official External Links / روابط خارجية رسمية
- **Rule:** Saved files must only use Phase 05 AssetId. / ملفات محفوظة عبر Phase 05 AssetId فقط
- (Later Phase 13 will provide preparation courses) / دورات تحضيرية لاحقًا من Phase 13

#### K. Cross-Phase References / الربط بالمراحل الأخرى
- Universities accepting the test (Phase 11) / جامعات تقبل الاختبار من Phase 11
- Scholarships requiring the test (Phase 12) / منح تطلب الاختبار من Phase 12
- Preparation Courses (Phase 13) / دورات تحضيرية من Phase 13
- CMS Articles and Guides (Phase 16) / مقالات وأدلة CMS من Phase 16
- Student Tools (Phase 18) / أدوات طلابية من Phase 18
- Registration or Support Services (Phase 20) / خدمات تسجيل أو دعم من Phase 20
- **Rule:** These are references only. Do not duplicate data, and do not use fake numbers. / قاعدة: مراجع فقط، بدون نسخ بيانات، وبدون أرقام وهمية

#### L. Import, Evidence & Review / الاستيراد والأدلة والمراجعة
- Original Imported Name / الاسم الأصلي المستورد
- Normalized Canonical Name / الاسم الموحد
- Deterministic Key 
- Source ID 
- Source URL 
- Content Hash 
- Retrieved At 
- Evidence Snippet 
- Verification Results / نتائج التحقق
- Conflicting Fields / الحقول المتعارضة
- Merge Proposals / اقتراحات الدمج
- Review Status / حالة المراجعة
- **Rule:** Confidence or source trust must never cause automatic publishing. / قاعدة: الثقة أو confidence لا تعني نشر تلقائي

#### M. Missing Data & Readiness / النقص والجاهزية
- Missing Fields / الحقول الناقصة
- Missing Fees / الرسوم ناقصة
- Missing Registration Link / رابط التسجيل ناقص
- Outdated Price / السعر قديم
- Unofficial Source / المصدر غير رسمي
- Broken Link / الرابط لا يعمل
- Incomplete Data / البيانات غير مكتملة
- Readiness Statuses: `IMPORTED`, `INCOMPLETE`, `NEEDS_REVIEW`, `READY_TO_PUBLISH`, `PUBLISHED`, `REJECTED`, `ARCHIVED` / الحالات

#### N. Public Preview & Publishing / المعاينة والنشر
- Public preview of what the student will see. / معاينة عامة لما سيظهر للطالب
- Displays only approved data. / تعرض البيانات المعتمدة فقط
- Does not display staged, imported, or unreviewed data. / لا تعرض staged أو imported أو unreviewed
- Publish button is disabled until all conditions are met. / زر النشر لا يعمل إلا بعد اكتمال الشروط
- Public page link only appears when status is `PUBLISHED`. / رابط الصفحة العامة يظهر فقط عند PUBLISHED

#### O. Future Student-Facing Enhancements / إضافات لاحقة للطالب
- FAQ 
- Comparison (e.g., IELTS vs TOEFL vs Duolingo) / مقارنة IELTS vs TOEFL vs Duolingo
- 4 / 8 / 12 Week Preparation Plans / خطة تحضير 4 / 8 / 12 أسابيع
- Approximate Score Calculator / حاسبة درجة تقريبية
- Price Change or Registration Opening Alerts / تنبيهات تغير السعر أو فتح التسجيل
- Save Test to Favorites / حفظ الاختبار في المفضلة
- Share Page / مشاركة الصفحة

### 22.2 Explicit Strict Rules
- **No Fake Metrics:** Do not use hardcoded counts (e.g., Universities 180, Scholarships 42, Centers +1400).
- **No Auto-Publish:** Publishing must always be manual or explicitly authorized post-review.
- **No Direct Imports in Test Page:** Import actions must route to `/admin/imports/international-tests`.
- **No Payments in Phase 09:** Phase 09 does not handle actual payment transactions.
- **No Reference Data Duplication:** Do not duplicate countries, cities, currencies, or languages from Phase 07.
- **No Public Display without PUBLISHED:** The public view must strictly guard against non-published records.
"""

new_content = content[:start_index] + new_section

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated successfully")
