# EconQuest · IB Economics HL

Chapter 1: Introduction to economics. Six short lessons cover syllabus 1.1 and 1.2 using the fictional HarbourFest case, with 48 quiz questions, six labs, worked examples, glossary helpers, read-aloud, spaced review, XP and local usage statistics.

Live app: https://meadastouchnet.github.io/econquest-ib-economics/

## Run locally

Run `python -m http.server 8765` in this folder and open http://localhost:8765. No build or package installation is required. Internet access loads optional Google fonts and KaTeX formula rendering. Progress is stored in this browser; it is not synced between devices.

## Curriculum and sources

Chapter 1 is shared by SL and HL. Lesson IDs 1.1a–d map to syllabus 1.1, and 1.2a–b to 1.2. The app is a practice companion, not a replacement for the approximately ten teaching hours recommended for Unit 1. Units 2–4 are labelled coming soon; mixed HL content will be marked when those units are built.

Scope checked against the IB Economics guide, first assessment 2022, Unit 1, pages 22–24, and the IB subject brief:
- https://www.ibo.org/programmes/diploma-programme/curriculum/individuals-and-societies/economics/
- https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/sl-economics-en.pdf
- Guide copy: https://www.ibdeconomics.com/uploads/1/1/7/5/11758934/new_economics_guide_first_assessment_2022.pdf

All teaching text and questions are original. Festival data are fictional. This project is independent of the IB.

## Structure

`js/content/chapter1.js` holds lessons, questions and formulas. `units.js` registers built and planned units; `glossary.js` holds definitions. `js/labs.js` contains interactive activities. `js/config.js` sets app identity and the separate progress storage key. `docs/ROADMAP.md` tracks coverage and checks.

## Engine credit

Adapted from MeadastouchNet/bizquest-ib-business. The shared engine provides quizzes, review scheduling, read-aloud, calculator, progress and usage statistics.
