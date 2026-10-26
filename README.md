# EconQuest · IB Economics HL

All four units of IB Economics HL: introduction, microeconomics, macroeconomics and the global economy. Short lessons use the fictional HarbourFest and Harbourland cases, with interactive labs, worked examples, quizzes, glossary helpers, read-aloud, spaced review, XP and local usage statistics.

46 lessons, 337 quiz questions, 49 activities and 300 glossary entries. The remaining chapters add 40 lessons, 289 questions and 43 activities.

Live app: https://meadastouchnet.github.io/econquest-ib-economics/

## Assessment studio

Open **Assessment studio** from the home page, lesson links or footer: 26 diagram construction tasks (12 comparison models), timed Paper 1/2/HL Paper 3 exercises with 11 checked numerical parts, IA preparation, sourced cases and an initial skills evidence tracker. Written feedback is formative self-review, not automated IB marking. Quiz recall and independent assessment are distinguished. See [the review response](docs/ASSESSMENT-REVIEW.md) for scope, checks and remaining gaps.

## Run locally

Run `python -m http.server 8765` in this folder and open http://localhost:8765. No build or package installation is required. Internet access loads optional Google fonts and KaTeX formula rendering. Progress is stored in this browser; it is not synced between devices.

## Curriculum and sources

Chapter 1 is shared by SL and HL. Lesson IDs 1.1a–d map to syllabus 1.1, and 1.2a–b to 1.2. Units 2–4 cover every remaining syllabus topic; larger topics are split into short lessons. HL-only topics and extensions are marked. See `docs/SYLLABUS.md` for coverage. The app is a practice companion alongside classroom teaching, current real-world examples and extended exam practice.

Scope checked against the IB Economics guide, first assessment 2022, and the IB subject brief:
- https://www.ibo.org/programmes/diploma-programme/curriculum/individuals-and-societies/economics/
- https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/sl-economics-en.pdf
- Guide copy: https://www.ibdeconomics.com/uploads/1/1/7/5/11758934/new_economics_guide_first_assessment_2022.pdf

All teaching text and questions are original. Festival data are fictional. This project is independent of the IB.

## Structure

`js/content/chapter1.js` and `unit2.js`–`unit4.js` hold lessons, questions and formulas. `units.js` registers units; `glossary.js` combines the glossary files. `js/labs.js` contains interactive activities, including market, AD/SRAS and exchange-rate curve models. `js/config.js` sets app identity and the separate progress storage key. `docs/ROADMAP.md` tracks coverage and checks.

## Verification

Run `node C:/Users/jespe/.codex/skills/ib-learning-app/scripts/validate_content.mjs .` for content structure and term destinations. With the local server running on port 8877, `node scripts/verify-course.cjs` checks lesson routes, all quiz answers, generic lab challenges, curve-shifting challenges, glossary helpers and phone layouts. The browser script requires Playwright and Edge; adjust its local Playwright import for another machine.

Run `node scripts/verify-assessment.cjs` for the studio checks against port 8877.

## Engine credit

Adapted from MeadastouchNet/bizquest-ib-business. The shared engine provides quizzes, review scheduling, read-aloud, calculator, progress and usage statistics.
