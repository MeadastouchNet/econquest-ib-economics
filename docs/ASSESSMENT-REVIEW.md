# EconQuest: curriculum review improvements

26 October 2026. The four-unit structure is retained. This release improves assessment practice; it does not certify complete IB exam readiness.

## Delivered

- **26 diagram construction tasks:** blank canvases, curves, flow arrows, labels, shaded areas, keyboard coordinates, saved explanations and SVG downloads. Twelve have visual comparison models; all have task-specific feedback and self-review criteria. Guidance stays hidden until requested.
- **Three original timed written exercises:** Paper 1 (25 marks, 75 minutes), Paper 2 (40 marks, 105 minutes), HL Paper 3 (two compulsory 30-mark questions, 105 minutes). Papers 1/2 practise one complete response, without reproducing the examination's question choices. Eleven numerical parts have answer checks. Written feedback is structured self-review, not automated examiner marking.
- **Saved attempts:** timers survive navigation/reload, and late submissions/prior help are recorded. Responses can be downloaded. Fresh attempts retain the immediately previous attempt in exported progress. Existing Usage stats export/import/reset includes the studio.
- **IA planner:** three commentary plans; checks for different units, sources and key concepts; publication dates within the year before writing; approximate word count; article-specific planning and formative A–F criteria prompts. Students select their own articles and write their own work.
- **Real evidence:** historical ONS inflation data, UK soft drinks levy reformulation evidence, and verified 2023 Kenya/Viet Nam electricity/clean cooking access. Prompts distinguish facts, models and judgement. The SDG trend extension requires earlier observations from official sources.
- **Skills evidence:** 26 objective records link teaching to saved diagram attempts, guidance use and self-review. Independent assessment/mastery remain unverified. Existing percentages are relabelled **quiz recall**.
- **Targeted content:** appended HL export-revenue quiz with a fillable working cell; more explicit shared UBI, anti-discrimination and inequality/growth/stability teaching; consistent Engel-axis convention. Existing question IDs are preserved.

Totals: **46 lessons, 337 quiz questions, 49 existing lesson activities, 300 glossary entries**, plus the assessment studio. Studio tasks are separate from the lesson quiz/lab counts.

## Review flags checked

| Flag | Finding / action |
|---|---|
| Five-sector flow; equity/factor ownership | Existing teaching retained; two separate construction tasks added. |
| PED/PES/Engel curves | Construction tasks added; Engel work correctly labelled shared SL/HL. |
| Intervention and four externalities | Separate tasks added; tax/subsidy and all four externalities have comparison models. Numerical welfare extensions are labelled HL. |
| HL firm equilibria/losses/monopolistic competition | Multi-equilibrium drawing prompts and specific feedback added. |
| Unemployment, money, fiscal policy, crowding out | Construction tasks added; money and crowding out labelled HL; fiscal task compares Keynesian/new classical assumptions. |
| Inequality policies and consequences | UBI/anti-discrimination were briefly discussed under an HL card. Shared teaching now develops these and growth/social stability explicitly. |
| Trade calculations and PPCs | Export-revenue quiz and comparative-advantage PPC task added. |
| Quotas and subsidies | New tasks plus a multi-part Paper 3 quota/welfare problem. |
| WTO/integration/monetary unions | Existing 4.4 cards cover conflicting interests, unequal bargaining resources, trade creation/diversion and shared-currency costs. A dedicated written integration task remains a follow-up. |
| Currency determinants and systems | Existing 4.5 cards/lab include remittances, investment and relative rates. Added defended-peg/managed-rate task/model. |
| J-curve; poverty cycle | Dedicated HL J-curve task/model and shared causal-loop task added. |
| SDG country evidence | Two-country, two-indicator snapshot added; time-series extension still requires research. |

## Remaining gaps

1. Teacher-validated independent diagram and written assessment. Checklist ticks do not establish quality or award an IB mark.
2. A complete official sub-point database and item-level audit of legacy SL/HL labels. The new register covers the 26 diagram objectives only.
3. Visual exemplars for the remaining 14 diagram tasks, more unfamiliar variants and full question-choice sets for Papers 1/2.
4. More current sourced cases across lessons and verified longitudinal SDG evidence. The historical snapshots do not establish policy causality.
5. Teacher-reviewed mastery thresholds and adaptive revision based on independently assessed performance.

## Verification

Content validation checks all four units, 46 lessons, 337 quizzes and 300 glossary entries. Browser checks cover existing lessons/quizzes/labs, formulas, glossary, review/stats, and the studio's drawing controls, all task routes, paper mark totals/calculations, saving, timers, IA rules, export/import/reset and 375-pixel layouts. Screenshots of desktop/phone tax drawing and comparison models were visually inspected. No browser page errors were observed.

Run `node scripts/verify-course.cjs` and `node scripts/verify-assessment.cjs` against a local preview at port 8877. Both use Playwright and Edge; set `PLAYWRIGHT_PATH` for the assessment check on another machine.

## Sources

- [IB Economics HL subject brief](https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/hl-economics-en.pdf) and [subject page](https://www.ibo.org/programmes/diploma-programme/curriculum/individuals-and-societies/economics/): currently linked first-assessment-2022 framework.
- [IB-authored Economics guide hosted by IBDEconomics](https://www.ibdeconomics.com/uploads/1/1/7/5/11758934/new_economics_guide_first_assessment_2022.pdf): relevant diagram/HL flags, assessment outlines and IA requirements checked. School-only updates/examiner materials were not verified.
- [ONS December 2023 CPI bulletin](https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/december2023).
- [HM Treasury/HMRC consultation](https://www.gov.uk/government/consultations/strengthening-the-soft-drinks-industry-levy/strengthening-the-soft-drinks-industry-levy-consultation): historical reformulation evidence, not current levy thresholds.
- [World Bank Kenya](https://esgdata.worldbank.org/data/countries?iso3=KEN) and [Viet Nam](https://esgdata.worldbank.org/data/countries?iso3=VNM): 2023 electricity/clean cooking observations checked 26 October 2026. Historical values may be revised.

All new prompts, questions, feedback and schematic models are original. This project is independent of the IB.
