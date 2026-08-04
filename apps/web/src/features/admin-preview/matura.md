# Matura — عدة دول أوروبية
## ملف بيانات عائلة شهادات وامتحانات إنهاء الثانوية والقبول الجامعي

> **الاسم العام:** Matura / Maturità / Maturita / Maturität  
> **التصنيف الصحيح:** عائلة مؤهلات وامتحانات وطنية، وليست اختبارًا أوروبيًا واحدًا  
> **الفئة:** اختبارات ومؤهلات القبول حسب الدولة والنظام التعليمي  
> **الدول المغطاة:** النمسا، سويسرا، بولندا، التشيك، سلوفاكيا، المجر، كرواتيا، سلوفينيا، إيطاليا  
> **أنظمة مرتبطة بحذر:** البوسنة والهرسك، صربيا، الجبل الأسود، مقدونيا الشمالية  
> **الإصدار المرجعي:** 2026.08  
> **آخر تحقق:** 02 أغسطس 2026  
> **حالة البيانات:** جاهزة للاستخدام التجريبي في منصة منارتك  
> **تنبيه حرج:** كلمة Matura لا تشير إلى اختبار موحد. يجب ربط كل سجل بالدولة والجهة المنظمة والسنة ونوع المدرسة والمواد ونظام الدرجات.

---

# 1. التعريف العام

## 1.1 ما المقصود بـMatura؟

مصطلح يستخدم في دول أوروبية متعددة للدلالة على:

- امتحان إنهاء الثانوية.
- شهادة النضج الأكاديمي.
- مؤهل دخول التعليم العالي.
- نتيجة تجمع الدراسة المدرسية والامتحانات النهائية.
- معيار تستخدمه الجامعات في المفاضلة.

## 1.2 الأسماء المحلية

| الدولة | الاسم المحلي |
|---|---|
| النمسا | Matura / Reifeprüfung / Reife- und Diplomprüfung |
| سويسرا | Matura / Maturität / Maturité / Maturità |
| بولندا | Egzamin maturalny |
| التشيك | Maturitní zkouška |
| سلوفاكيا | Maturitná skúška |
| المجر | Érettségi vizsga |
| كرواتيا | Državna matura |
| سلوفينيا | Splošna matura / Poklicna matura |
| إيطاليا | Esame di Stato / Maturità |

## 1.3 لماذا لا يصح إنشاء اختبار واحد؟

تختلف الأنظمة في:

- عدد المواد.
- المواد الإلزامية.
- المستوى الأساسي والمتقدم.
- الامتحانات الشفوية.
- المشروع أوالبحث.
- الدرجات المدرسية التراكمية.
- الحد الأدنى للنجاح.
- الإعادة.
- القبول الجامعي.
- الاعتراف بالشهادة الأجنبية.

## 1.4 الاستخدامات

- إنهاء الثانوية.
- التقديم للجامعة.
- ترتيب المتقدمين.
- التقديم للمنح.
- المعادلة الأكاديمية.
- إثبات دراسة مواد مطلوبة.

## 1.5 ما الذي لا تضمنه؟

- القبول.
- المنحة.
- الإعفاء من اللغة.
- الإعفاء من اختبارات الطب أوالفنون.
- الاعتراف التلقائي في كل دولة.
- وجود درجة أوروبية موحدة.

---

# 2. المقارنة السريعة

## 2.1 جدول الأنظمة

| الدولة | طبيعة النظام | المركزية | المسار المهني |
|---|---|---|---|
| النمسا | شهادة + مشروع/امتحانات | جزئية | نعم |
| سويسرا | شهادة كانتونية أوامتحان اتحادي | مختلطة | نعم |
| بولندا | امتحان وطني | عالية | ضمن النظام المدرسي |
| التشيك | جزء مشترك + جزء مدرسي | مختلطة | نعم |
| سلوفاكيا | خارجي + داخلي | مختلطة | نعم |
| المجر | امتحان بمستويين | عالية | ضمن أنواع المدارس |
| كرواتيا | Državna matura | عالية | حسب المدرسة |
| سلوفينيا | عامة ومهنية | عالية | نعم بوضوح |
| إيطاليا | رصيد مدرسي + امتحان دولة | مختلطة | مسارات ثانوية متعددة |

## 2.2 قاعدة منصة منارتك

```yaml
maturaFamily:
  unifiedEuropeanExam: false
  countrySpecific: true
  subjectBased: true
  unifiedScoreScale: false
  unifiedPassRule: false
```

---

# 3. النمسا

## 3.1 الاسم

- AHS: Standardisierte kompetenzorientierte Reifeprüfung.
- BHS: Standardisierte kompetenzorientierte Reife- und Diplomprüfung.
- الاسم الشائع: Zentralmatura أوMatura.

## 3.2 الجهات

- Bundesministerium für Bildung.
- المدارس.
- اللجان المحلية.
- الاختبارات المركزية في مواد محددة.

## 3.3 AHS

المسار الأكاديمي العام، ويتكون من:

1. Abschließende Arbeit مع العرض والمناقشة.
2. Klausurprüfungen.
3. Mündliche Prüfungen.

## 3.4 ترتيبات 2026 الانتقالية

من الدورة الرئيسية 2026 وحتى 2028/2029 يمكن في حالات الانتقال اختيار:

- Abschlussarbeit.
- أوامتحان كتابي إضافي.
- أوامتحان شفوي إضافي.

## 3.5 BHS

المسار المهني المتقدم، ويتضمن عادة:

- Diplomarbeit.
- ثلاثة أوأربعة اختبارات كتابية.
- اختبارين أوثلاثة شفوية.
- مواد مهنية.

## 3.6 المواد المركزية

مثل:

- Unterrichtssprache.
- Lebende Fremdsprache.
- Mathematik أوAngewandte Mathematik.

## 3.7 الدرجات

| الدرجة | المعنى |
|---:|---|
| 1 | ممتاز |
| 2 | جيد |
| 3 | مرضٍ |
| 4 | نجاح |
| 5 | رسوب |

## 3.8 التعويض والإعادة

- يمكن أداء Kompensationsprüfung بعد الرسوب في اختبار كتابي.
- يمكن إعادة المجال السلبي حتى ثلاث مرات بعد المحاولة الأولى وفق القواعد.

## 3.9 دخول الجامعة

تمنح Matura مؤهل دخول عام، لكن قد توجد:

- قيود مقاعد.
- اختبارات طب.
- اختبارات فنون.
- شروط لغة.

## 3.10 مصادر النمسا

- https://www.bmb.gv.at/Themen/schule/schulpraxis/zentralmatura.html
- https://www.bmb.gv.at/Themen/schule/schulpraxis/zentralmatura/srdp_ahs.html
- https://www.bmb.gv.at/Themen/schule/schulpraxis/zentralmatura/srdp_bhs.html

---

# 4. سويسرا

## 4.1 الأسماء

- Maturität بالألمانية.
- Maturité بالفرنسية.
- Maturità بالإيطالية.

## 4.2 الأنواع الثلاثة

1. Gymnasiale Maturität.
2. Berufsmaturität.
3. Fachmaturität.

## 4.3 Gymnasiale Maturität

تمنح وصولًا مباشرًا من حيث نوع المؤهل إلى:

- الجامعات.
- ETH/EPFL.
- جامعات إعداد المعلمين وفق الشروط.

## 4.4 Berufsmaturität

تجمع التدريب المهني مع تعليم عام متقدم، وتتيح الوصول إلى جامعات العلوم التطبيقية في المجال المناسب.

## 4.5 Fachmaturität

تتيح الوصول إلى مجالات تعليم عالٍ مرتبطة بالتخصص، وفق نوع الشهادة والكانتون.

## 4.6 Passerelle

حامل Berufsmaturität أوFachmaturität المعترف بها يستطيع، بعد نجاح Ergänzungsprüfung Passerelle، الوصول إلى الجامعات، ويعامل المؤهل المركب كالمعادلة لـGymnasiale Maturität.

## 4.7 الامتحان السويسري الاتحادي

- تنظمه SBFI تحت إشراف Schweizerische Maturitätskommission.
- مرتان سنويًا.
- في المناطق اللغوية الثلاث.
- التحضير ممكن بالدراسة الذاتية أوالمدارس الخاصة.

## 4.8 الدرجات

| الدرجة | المعنى |
|---:|---|
| 6 | الأعلى |
| 5 | جيد جدًا |
| 4 | نجاح |
| أقل من 4 | غير كافٍ |

## 4.9 Maturaarbeit

بحث أوعمل موسع مع عرض، ويعد جزءًا مهمًا من النظام.

## 4.10 الإعادة

في الامتحان الاتحادي توجد محاولة ثانية، مع إعادة المواد الأقل من 4 وفق اللوائح.

## 4.11 مصادر سويسرا

- https://www.sbfi.admin.ch/de/maturitaet
- https://www.sbfi.admin.ch/de/gymnasiale-maturitaet
- https://www.sbfi.admin.ch/de/schweizerische-maturitaetspruefung
- https://www.sbfi.admin.ch/de/ergaenzungspruefung-passerelle

---

# 5. بولندا

## 5.1 الاسم والجهة

- الاسم: Egzamin maturalny.
- الجهة: CKE واللجان الإقليمية ووزارة التعليم.

## 5.2 المواد الإلزامية 2026

### شفوي

- اللغة البولندية.
- لغة أجنبية حديثة.
- لغة الأقلية عند الانطباق.

### كتابي أساسي

- اللغة البولندية.
- الرياضيات.
- لغة أجنبية حديثة.
- لغة الأقلية عند الانطباق.

## 5.3 المادة الإضافية

يجب أداء مادة إضافية واحدة على الأقل في المستوى الموسع.

في 2026 يكفي أداء الورقة الإضافية للحصول على الشهادة العامة؛ لا يطبق عليها حد 30% العام.

## 5.4 شرط النجاح

- 30% على الأقل في كل امتحان إلزامي شفوي.
- 30% على الأقل في كل امتحان إلزامي كتابي.
- أداء مادة موسعة واحدة على الأقل.

## 5.5 المواد الموسعة

مثل:

- Biology.
- Chemistry.
- Physics.
- Geography.
- History.
- Mathematics.
- Polish.
- Informatics.
- Philosophy.
- Social Studies.
- Business and Management.
- Languages.

## 5.6 دورة 2026

- الامتحانات الرئيسية في مايو.
- نتائج الدورة الرئيسية في 8 يوليو 2026.
- توجد مواعيد إضافية وتصحيحية.

## 5.7 نتائج 2026

بلغ النجاح:

- 85.9% في liceum العام.
- 71.3% في technikum.
- 15.4% في branżowa szkoła II stopnia.

## 5.8 الجامعة

لا يوجد مجموع واحد؛ تحدد الجامعة المواد والأوزان والحدود.

## 5.9 مصادر بولندا

- https://cke.gov.pl/egzamin-maturalny/
- https://www.gov.pl/web/edukacja/egzamin-maturalny2
- https://www.gov.pl/web/edukacja/matura-2026-harmonogram-egzaminow
- https://www.gov.pl/web/edukacja/wyniki-egzaminu-maturalnego-2026

---

# 6. جمهورية التشيك

## 6.1 الاسم والجهات

- Maturitní zkouška.
- MŠMT.
- CERMAT.
- المدرسة.

## 6.2 المكونان

1. Společná část.
2. Profilová část.

## 6.3 الجزء المشترك

يتكون من:

- Czech Language and Literature.
- اختيار بين Foreign Language وMathematics.

## 6.4 نوع الجزء المشترك

- Didactic Tests.
- تقييم نجاح/رسوب.
- نسبة نجاح.
- إدارة مركزية.

## 6.5 Profile Part

تتضمن:

- Czech Language and Literature.
- اللغة الأجنبية إذا اختيرت.
- مادتين أوثلاث مواد إضافية تحددها المدرسة.

## 6.6 أشكال Profile

- كتابي.
- شفوي.
- عملي.
- مشروع.
- دفاع عن مشروع.

## 6.7 الدورات

- Spring.
- Autumn.

## 6.8 درجات Profile

- 1 الأفضل.
- 4 نجاح.
- 5 رسوب.

## 6.9 النجاح

يجب النجاح في جميع المكونات الإلزامية.

## 6.10 مصادر التشيك

- https://maturita.cermat.cz/
- https://maturita.cermat.cz/menu/maturitni-zkouska/zkousky-spolecne-casti
- https://msmt.gov.cz/vzdelavani/stredni-vzdelavani/ukoncovani-vzdelavani-maturitni-zkouskou

---

# 7. سلوفاكيا

## 7.1 الاسم

Maturitná skúška.

## 7.2 الجهات

- وزارة التعليم.
- NIVaM/NUCEM.
- المدرسة.
- لجان Maturita.

## 7.3 المكونات

1. External Part — EČ.
2. Internal Part — IČ.
3. Written Internal Form للغات — PFIČ.
4. Oral Internal Form.

## 7.4 المواد الوطنية

تشمل:

- Slovak Language and Literature.
- Hungarian Language and Literature.
- Slovak Language and Slovak Literature.
- Mathematics.
- Foreign Languages.

## 7.5 مستويات اللغة

- B1.
- B2.
- C1 لبعض المدارس الثنائية.

## 7.6 مواعيد مارس 2026

- 10 مارس: اللغات التعليمية.
- 11 مارس: اللغات الأجنبية.
- 12 مارس: Mathematics.
- 13 مارس: مواد لغوية إضافية.

## 7.7 المواعيد البديلة

- أبريل 2026: موعد بديل.
- 2–7 سبتمبر 2026: موعد إصلاحي وبديل.

## 7.8 الدرجات

- 1 أفضل.
- 4 نجاح.
- 5 رسوب.
- توجد نسب وحدود منفصلة للمكونات.

## 7.9 eMaturita

توجد عمليات واختبارات إلكترونية ضمن خطة 2026، لكن النظام ليس إلكترونيًا بالكامل لكل الطلاب والمواد.

## 7.10 مصادر سلوفاكيا

- https://maturita-nivam.nucem.sk/sk/merania/narodne-merania/maturita
- https://maturita-nivam.nucem.sk/sk/merania/narodne-merania/maturita/roky/2025-2026
- https://www2.nucem.sk/en/measurements/maturita/about-maturita

---

# 8. المجر

## 8.1 الاسم الرسمي

Érettségi vizsga.

## 8.2 المستويان

- Középszint — متوسط.
- Emelt szint — متقدم.

## 8.3 المواد الأساسية المعتادة

- Hungarian Language and Literature.
- Mathematics.
- History.
- Foreign Language.
- مادة اختيارية.

## 8.4 أهمية المستوى المتقدم

قد تطلب الجامعة:

- مادة في Emelt szint.
- نسبة محددة.
- نقاطًا إضافية.
- مادة بعينها للطب أوالهندسة.

## 8.5 أنواع التقييم

- كتابي.
- شفوي.
- عملي.
- مشروع حسب المادة.

## 8.6 الدورات

- May–June.
- October–November.

## 8.7 ربيع 2026

بدأت الامتحانات الكتابية الرئيسية في 4 مايو 2026.

## 8.8 الدرجات

| الدرجة | المعنى |
|---:|---|
| 5 | ممتاز |
| 4 | جيد |
| 3 | متوسط |
| 2 | نجاح |
| 1 | رسوب |

## 8.9 رسوم 2026 عند انطباقها

- المستوى المتوسط: 48,000 HUF للمادة.
- المستوى المتقدم: 81,000 HUF للمادة.

## 8.10 مصادر المجر

- https://www.oktatas.hu/kozneveles/erettsegi
- https://www.oktatas.hu/kozneveles/erettsegi/2026tavaszi_vizsgaidoszak
- https://www.oktatas.hu/kozneveles/erettsegi/feladatsorok
- https://www.oktatas.hu/kozneveles/erettsegi/altalanos_tajekoztatas/vizsgadijak

---

# 9. كرواتيا

## 9.1 الاسم والجهة

- Državna matura.
- NCVVO.
- نظام Postani Student للقبول.

## 9.2 المواد الإلزامية

- Croatian Language.
- Mathematics.
- Foreign Language.

## 9.3 المستويات

توجد مستويات:

- Higher — A.
- Basic — B.

في Mathematics واللغات ومواد محددة وفق الكتالوج.

## 9.4 المواد الاختيارية

مثل:

- Biology.
- Chemistry.
- Physics.
- Informatics.
- History.
- Geography.
- Politics and Economy.
- Psychology.
- Sociology.
- Philosophy.
- Arts.
- Languages.

## 9.5 التسجيل

يتم عبر Postani Student للطلاب النظاميين، مع إجراءات خاصة للمترشحين الخارجيين.

## 9.6 الدورات

- First/Summer Session.
- Second/Autumn Session.

## 9.7 التقييم

تحدد NCVVO حدود الدرجات سنويًا لكل مادة ومستوى.

## 9.8 القبول

كل برنامج يحدد:

- المادة.
- المستوى.
- الوزن.
- الحد الأدنى.
- الاختبارات الإضافية.

## 9.9 لغات الأقليات

توجد ترتيبات للغات مثل:

- Italian.
- Serbian.
- Hungarian.
- Czech.

## 9.10 مصادر كرواتيا

- https://www.ncvvo.hr/
- https://www.ncvvo.hr/skolska-godina/2025-2026-ni/
- https://www.ncvvo.hr/ispitni-katalozi-za-drzavnu-maturu-2025-2026/
- https://www.postani-student.hr/

---

# 10. سلوفينيا

## 10.1 النوعان

1. Splošna matura.
2. Poklicna matura.

## 10.2 العامة

- تنهي Gymnasium.
- تتكون من خمس مواد.
- تتيح جميع أنواع برامج التعليم العالي من حيث نوع المؤهل.

## 10.3 المواد الإلزامية العامة

- اللغة الأم.
- Mathematics.
- Foreign Language.
- مادتان اختياريتان.

## 10.4 درجات العامة

- 1 رسوب.
- 2–5 نجاح.
- حتى 8 في بعض مواد المستوى الأعلى.
- الحد الأعلى العام 34 نقطة.

## 10.5 المهنية

- تنهي التعليم الفني والمهني.
- تتكون من أربع مواد.
- تتيح التعليم العالي المهني.
- قد تحتاج مادة إضافية من العامة لبعض البرامج الجامعية.

## 10.6 مكونات المهنية

1. اللغة الأم.
2. مادة تخصصية.
3. Mathematics أوForeign/Second Language.
4. منتج أوخدمة أومشروع مع دفاع.

## 10.7 أعلى نتيجة مهنية

23 نقطة.

## 10.8 نتائج 2026

- المهنية: 8 يوليو 2026.
- العامة: 13 يوليو 2026.
- الاعتراض الإلكتروني للعامة: 13–15 يوليو.

## 10.9 الدورات

### العامة

- Spring.
- Autumn.

### المهنية

- Spring.
- Autumn.
- Winter.

## 10.10 مصادر سلوفينيا

- https://www.ric.si/splosna-matura/
- https://www.ric.si/poklicna-matura/
- https://www.ric.si/splosna-matura/koledar-splosne-mature/
- https://www.ric.si/poklicna-matura/koledar-poklicne-mature/

---

# 11. إيطاليا

## 11.1 الاسم

Esame di Stato conclusivo del secondo ciclo، ويعرف باسم Maturità.

## 11.2 الجهات

- Ministero dell’Istruzione e del Merito.
- المدارس.
- لجان الامتحان.

## 11.3 المسارات

- Licei.
- Istituti tecnici.
- Istituti professionali.

## 11.4 مكونات 2026

- رصيد مدرسي: 40.
- الاختبار الأول: 20.
- الاختبار الثاني: 20.
- المقابلة: 20.
- Bonus حتى 5 وفق الشروط.
- Lode متاحة.

## 11.5 الدرجة

- الحد الأعلى: 100.
- النجاح من 60.
- 100 e lode للمتفوق المؤهل.

## 11.6 الاختبار الأول 2026

- اللغة الإيطالية.
- 18 يونيو 2026.
- مشترك وطنيًا.

## 11.7 الاختبار الثاني

- 19 يونيو 2026.
- مرتبط بمسار الدراسة.

## 11.8 المقابلة

تتضمن:

- ربطًا متعدد التخصصات.
- التربية المدنية.
- PCTO.
- المواد المحددة للدورة.
- تحليل مسار الطالب.

## 11.9 المترشح الخارجي

يستطيع التقديم وفق شروط العمر أوالدراسة، وقد يحتاج امتحانًا تمهيديًا.

## 11.10 مصادر إيطاليا

- https://www.mim.gov.it/web/guest/esame-di-stato-secondo-ciclo
- https://www.mim.gov.it/-/-maturita-2026-al-via-il-18-giugno-con-la-prova-di-italiano-i-candidati-sono-oltre-527-mila
- https://www.mim.gov.it/-/ordinanza-ministeriale-n-54-del-26-marzo-2026

---

# 12. أنظمة مرتبطة تحتاج صفحات مستقلة

## 12.1 البوسنة والهرسك

التعليم لامركزي بين:

- الكيانات.
- الكانتونات.
- Brčko District.

لا تنشئ سجلًا وطنيًا واحدًا باسم Bosnia National Matura.

## 12.2 صربيا

يستخدم مصطلح Državna matura في الإصلاحات، ويجب التحقق من سنة التنفيذ الفعلي وعدم الخلط مع الامتحان النهائي للمرحلة الأساسية.

## 12.3 الجبل الأسود

توجد Matura وProfessional Exam، وتحتاج صفحة رسمية مستقلة.

## 12.4 مقدونيا الشمالية

توجد State Matura وأنواع امتحانات نهائية أخرى، وتحتاج صفحة مستقلة.

---

# 13. الطالب الدولي

## 13.1 هل يؤدي الطالب اليمني Matura؟

عادة لا، إلا إذا كان يدرس داخل المدرسة الوطنية في الدولة.

## 13.2 المسار المعتاد

1. الشهادة اليمنية.
2. كشف الدرجات.
3. ترجمة معتمدة.
4. تصديق.
5. اعتراف أو معادلة.
6. إثبات لغة.
7. اختبار قبول عند الحاجة.
8. التقديم الجامعي.

## 13.3 الجهات التي قد تقيم الشهادة

- الجامعة.
- ENIC-NARIC.
- الوزارة.
- وكالة قبول وطنية.
- جهة معادلة.

## 13.4 الطب

قد يحتاج الطالب إلى:

- اختبار إضافي.
- مقابلة.
- لغة محلية متقدمة.
- ترتيب وطني.
- متطلبات علوم.

## 13.5 برامج الإنجليزية

قد تطلب IELTS أوTOEFL حتى لو تضمنت Matura مادة لغة أجنبية.

---

# 14. مقارنة الدرجات

## 14.1 النمسا

1 أفضل، 4 نجاح، 5 رسوب.

## 14.2 سويسرا

6 أفضل، 4 نجاح.

## 14.3 بولندا

نسبة مئوية؛ 30% للمواد الإلزامية في 2026.

## 14.4 التشيك

الجزء المشترك نجاح/رسوب، وProfile من 1 إلى 5.

## 14.5 سلوفاكيا

1 أفضل، 4 نجاح، 5 رسوب.

## 14.6 المجر

5 أفضل، 2 نجاح، 1 رسوب.

## 14.7 كرواتيا

نقاط وحدود درجات سنوية.

## 14.8 سلوفينيا

1 رسوب، 2–5 نجاح، وحتى 8 في المستوى الأعلى.

## 14.9 إيطاليا

60–100، مع Lode.

## 14.10 قاعدة التحويل

لا تحول الدرجات بين الدول دون جدول رسمي من الجامعة أوجهة الاعتراف.

---

# 15. الإعادة والمراجعة

## 15.1 النمسا

إعادة المجالات السلبية، مع Kompensationsprüfung لبعض الكتابي.

## 15.2 سويسرا

محاولة ثانية في الامتحان الاتحادي وفق قواعد المواد الأقل من 4.

## 15.3 بولندا

موعد إضافي وتصحيحي، وإمكانية تحسين النتائج لاحقًا.

## 15.4 التشيك

ربيع وخريف ومحاولات إصلاحية.

## 15.5 سلوفاكيا

مواعيد مارس وأبريل وسبتمبر للمكونات الوطنية.

## 15.6 المجر

ربيع وخريف وإعادة أوتحسين حسب حالة الطالب.

## 15.7 كرواتيا

دورة أولى وثانية.

## 15.8 سلوفينيا

Spring وAutumn، ومع Winter للمهنية.

## 15.9 إيطاليا

جلسات تعويضية واستثنائية للحالات المعتمدة.

---

# 16. التسهيلات والأمن

## 16.1 التسهيلات

قد تشمل:

- وقتًا إضافيًا.
- Braille.
- خطًا مكبرًا.
- قارئًا.
- كاتبًا.
- غرفة منفصلة.
- فواصل.
- أجهزة مساعدة.
- ترتيبات طبية.

## 16.2 الهوية

تختلف الوثائق المقبولة بين الأنظمة، وقد تشمل بطاقة وطنية أو جوازًا أو بطاقة طالب.

## 16.3 الأجهزة المحظورة

- الهاتف.
- Smartwatch.
- أدوات الاتصال.
- أدوات AI.
- ملاحظات غير مصرح بها.
- حاسبة غير معتمدة.

## 16.4 الآلة الحاسبة

ترتبط بالمادة والدولة والسنة، ولا توجد قاعدة موحدة.

---

# 17. التحضير

## 17.1 المصادر الأولى

- المنهج.
- Exam Catalogue.
- مواصفات المادة.
- أوراق سابقة.
- Marking Scheme.
- تعليمات الدورة.

## 17.2 خطة التحضير

1. تحديد الدولة.
2. تحديد نوع Matura.
3. تحديد المدرسة أوالمسار.
4. تحديد المواد.
5. تحديد المستوى.
6. تنزيل المنهج.
7. حل أوراق سابقة.
8. التدريب على الشفوي.
9. تجهيز المشروع.
10. مراجعة شروط الجامعة.

---

# 18. الأسئلة الشائعة

## 18.1 هل Matura اختبار موحد؟

لا.

## 18.2 هل كل دولة تستخدم الاسم نفسه؟

لا.

## 18.3 هل النجاح يضمن الجامعة؟

لا.

## 18.4 هل الطالب الدولي يؤديها؟

عادة يقدم شهادته الأجنبية.

## 18.5 هل Abitur من العائلة نفسها؟

نعم وظيفيًا، لكنه مؤهل ألماني مستقل.

## 18.6 هل A-Level هي Matura؟

ليست الاسم نفسه، لكنها تؤدي وظيفة مشابهة.

## 18.7 هل بولندا تطلب 30%؟

نعم للمواد الإلزامية في 2026.

## 18.8 هل النمسا لديها مشروع؟

نعم، مع ترتيبات انتقالية من 2026.

## 18.9 هل سلوفينيا لديها عامة ومهنية؟

نعم.

## 18.10 هل إيطاليا تستخدم 100 نقطة؟

نعم، والنجاح من 60.

## 18.11 هل الشهادة تنتهي؟

المؤهل النهائي عادة لا ينتهي، لكن القبول واللغة قد يتغيران.

---

# 19. وظائف صفحة منارتك

## 19.1 الوظائف المقترحة

- اختيار الدولة.
- اختيار نوع Matura.
- عرض الجهة.
- اختيار سنة الامتحان.
- عرض المواد.
- عرض المستوى.
- حاسبة الدرجة.
- عرض المواعيد.
- مقارنة الجامعات.
- التحقق من المعادلة.
- عرض مسار الطالب الدولي.
- عرض الإعادة.
- عرض التسهيلات.
- فتح المصادر الرسمية.

---

# 20. النموذج المعماري

## 20.1 عائلة المؤهل

```yaml
qualificationFamily:
  key: european_matura_family
  unifiedProvider: null
  unifiedExam: false
  unifiedScoreScale: false
  unifiedPassRule: false
  countrySpecific: true
```

## 20.2 النسخ الوطنية

```yaml
variants:
  - AT_AHS_REIFEPRUEFUNG
  - AT_BHS_REIFE_DIPLOM
  - CH_GYMNASIALE_MATURITAET
  - CH_BERUFSMATURITAET
  - CH_FACHMATURITAET
  - PL_MATURA
  - CZ_MATURITA
  - SK_MATURITA
  - HU_ERETTSEGI
  - HR_DRZAVNA_MATURA
  - SI_SPLOSNA_MATURA
  - SI_POKLICNA_MATURA
  - IT_ESAME_DI_STATO
```

## 20.3 نموذج النسخة الوطنية

```yaml
nationalQualificationVariant:
  key: PL_MATURA_2026
  countryCode: PL
  localName: Egzamin maturalny
  providerId: CKE
  examYear: 2026
  qualificationType: school_leaving_and_higher_education_entry
```

## 20.4 نموذج المادة

```yaml
maturaSubject:
  nationalVariantId: HR_DRZAVNA_MATURA_2026
  subjectKey: mathematics
  availableLevels:
    - A
    - B
  mandatoryCategory: core
  syllabusVersionId: hr_math_2026
```

## 20.5 نموذج نتيجة إيطاليا

```yaml
assessmentModel:
  qualificationVariantId: IT_MATURITA_2026
  schoolCreditMaximum: 40
  firstWrittenMaximum: 20
  secondWrittenMaximum: 20
  oralMaximum: 20
  passScore: 60
  maximumScore: 100
  honoursAvailable: true
```

## 20.6 نموذج شرط بولندا

```yaml
passRule:
  qualificationVariantId: PL_MATURA_2026
  mandatoryWrittenMinimumPercent: 30
  mandatoryOralMinimumPercent: 30
  additionalExtendedSubject:
    attendanceRequired: true
    minimumPercentForCertificate: null
```

## 20.7 نموذج متطلب الجامعة

```yaml
universityMaturaRequirement:
  universityId: university_id
  programmeId: programme_id
  admissionCycle: 2026_2027
  acceptedVariants: []
  requiredSubjects: []
  requiredLevels: []
  conversionFormulaId: formula_id
  languageRequirements: []
  additionalEntranceTests: []
```

## 20.8 نموذج تقييم الشهادة الأجنبية

```yaml
foreignCertificateEvaluation:
  applicantId: applicant_id
  sourceCountryCode: YE
  targetCountryCode: AT
  sourceQualificationId: qualification_id

  outcome:
    - direct_access
    - subject_restricted_access
    - preparatory_programme
    - additional_exams_required
    - not_recognised
```

---

# 21. ملاحظات معمارية لمنارتك

1. صنّف Matura كQualification Family.
2. لا تنشئ Provider أوروبيًا موحدًا.
3. Country Variant إلزامية.
4. Local Name إلزامي.
5. Exam Year إلزامي.
6. School Type قد يغير المؤهل.
7. General وVocational Tracks منفصلان.
8. Austria AHS وBHS منفصلان.
9. Switzerland لديها ثلاثة أنواع.
10. Slovenia لديها نوعان.
11. Italy تجمع School Credit وExam.
12. Czechia تستخدم Common وProfile.
13. Slovakia تستخدم External وInternal.
14. Hungary تستخدم مستويين.
15. Croatia تستخدم Levels في مواد محددة.
16. لا يوجد Unified Score.
17. لا يوجد Unified Pass Rule.
18. Oral وWritten وProject مكونات مستقلة.
19. University Conversion Formula مستقلة.
20. Pass لا يساوي Admission.
21. Foreign Recognition Workflow مستقل.
22. Language Requirement مستقل.
23. Retake Policy مرتبط بالسنة.
24. Accommodations مرتبطة بالمكون.
25. Calculator Policy مرتبطة بالمادة.
26. لا تحول الدرجات دون مصدر رسمي.
27. الملفات عبر Phase 05 AssetId.
28. لا تحفظ Raw File URLs في سجلات المجال.
29. الدول والأقاليم من Phase 07.
30. الصفحة تعرض آخر تحقق لكل دولة.
31. يجب عرض تنبيه «Matura ليست اختبارًا واحدًا».

---

# 22. ملاحظة الجودة النهائية

البيانات الأكثر تغيرًا:

- مواعيد الامتحانات.
- المواد.
- المستويات.
- قواعد النجاح.
- الإعادة.
- الرسوم.
- التسهيلات.
- الاعتراضات.
- متطلبات الجامعة.
- المعادلة.
- الإصلاحات الرقمية.

يجب حفظ:

- `lastVerifiedAt`
- `effectiveFrom`
- `effectiveTo`
- `countryCode`
- `regionCode`
- `examYear`
- `qualificationVariant`
- `sourceUrl`
- `sourceAuthority`
- `verificationStatus`
