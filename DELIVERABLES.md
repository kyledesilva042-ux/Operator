# Operator — Landing Page Deliverables

Companion to `index.html` (the production landing page). Contains all copy, structure, and design specifications.

---

## 1. Hero Headlines — 20 Options

1. **Know exactly what to do next with your money.** ← *used on the page*
2. Stop guessing. Start operating.
3. Your money has a next move. We'll show you.
4. Clarity is a financial strategy.
5. Someone finally looked at your actual numbers.
6. The plan your money has been waiting for.
7. You're not bad with money. You're missing a map.
8. Financial freedom has a first step. Here's yours.
9. Every dollar you have, pointed in the right direction.
10. Your complete financial picture. Your exact next move.
11. Decent income. Zero traction. Let's fix the second part.
12. What would an operator do with your money?
13. The end of "am I doing this right?"
14. One upload. One roadmap. Ninety days of certainty.
15. Advice is everywhere. Answers are here.
16. Built for the years before you're wealthy.
17. Analyzed by AI. Verified by humans. Built for you.
18. You don't need motivation. You need instructions.
19. Run your money like it matters.
20. The financial operating system for people going somewhere.

**Hero subheadline (used):**
> Operator is an AI-assisted, human-reviewed financial operating system: upload your numbers, and get a personalized roadmap showing the exact moves that take you toward financial freedom.

**CTAs:** Primary — *Start My Financial Reset* · Secondary — *See a Sample Report*

---

## 2. Page Hierarchy

```
1.  Nav (fixed, glass)          — logo, anchors, primary CTA
2.  Hero                        — badge, H1, sub, dual CTA, trust line, roadmap preview card
3.  Problem                     — 3 cards (budget apps / generic content / advisors) + core-message statement
4.  How It Works                — 4-step row: Upload → AI Analysis → Human Review → Personal Roadmap
5.  What's Included             — 8 deliverables, 2-col checklist
6.  Sample Dashboard            — Position Score, Free Cash Flow, Next Milestone, Debt Sequence bars, This Week timeline
7.  Why Operator Is Different   — comparison table vs. budget apps, credit repair, advisors, AI chatbots
8.  Testimonials                — 3 quotes under "I finally found adults."
9.  FAQ                         — 20 objections, accordion
10. Pricing                     — 3 tiers, placeholder prices ($XX / $XXX / $XXX per quarter)
11. Final CTA                   — "Stop guessing. Start operating."
12. Footer                      — links, compliance disclaimer, copyright
```

---

## 3. Wireframe (mobile-first)

```
MOBILE (stacked)                      DESKTOP (≥720px)
┌──────────────────────┐             ┌────────────────────────────────────┐
│ ◻ Operator      [CTA]│             │ ◻ Operator   links…          [CTA] │
├──────────────────────┤             ├────────────────────────────────────┤
│ ● human-reviewed badge│            │  H1 (max-width 900px, left)        │
│ H1 — huge, 2 lines   │             │  Sub · [Primary] [Secondary]       │
│ Sub                  │             │ ┌────────────────────────────────┐ │
│ [Primary CTA]        │             │ │ Roadmap preview: 3 priorities  │ │
│ [Secondary CTA]      │             │ └────────────────────────────────┘ │
│ trust microcopy      │             ├────────────────────────────────────┤
│ ┌──────────────────┐ │             │ PROBLEM: heading + 3 cards in row  │
│ │ roadmap preview  │ │             │ big pull-quote statement           │
│ │ (priorities stack)│ │            ├────────────────────────────────────┤
│ └──────────────────┘ │             │ HOW: 4 steps in one bordered row   │
├──────────────────────┤             ├────────────────────────────────────┤
│ PROBLEM (cards stack)│             │ INCLUDED: 2×4 checklist grid       │
│ HOW (steps stack)    │             ├────────────────────────────────────┤
│ INCLUDED (list)      │             │ DASHBOARD: 3-col grid, wide debt   │
│ DASHBOARD (stack)    │             │ card spans 2                        │
│ COMPARE (h-scroll)   │             │ COMPARE: full table                │
│ QUOTES (stack)       │             │ QUOTES: 3-col                      │
│ FAQ (accordion)      │             │ FAQ: single col, max 820px         │
│ PRICING (stack,      │             │ PRICING: 3-col, center featured    │
│  featured first)     │             ├────────────────────────────────────┤
│ FINAL CTA (centered) │             │ FINAL CTA centered · FOOTER        │
│ FOOTER               │             └────────────────────────────────────┘
└──────────────────────┘
```

---

## 4. UI Recommendations

- **One accent, used sparingly.** The warm off-white (`#E8E4DC`) marks only "signal" moments: human-review badges, progress fills, the featured plan. Everything else is monochrome.
- **Glassmorphism in exactly one place:** the fixed nav (`backdrop-filter: blur(20px)` over `rgba(22,22,26,0.72)`). Nowhere else.
- **Borders, not shadows.** Depth comes from 1px borders on three raised surface tones — never drop shadows, never gradients.
- **Huge type, tight tracking.** H1 at `clamp(2.6rem, 8.5vw, 5.25rem)` with `-0.03em` letter-spacing; dimmed spans (`--text-tertiary`) inside headlines create hierarchy without a second font.
- **Apple spacing:** section padding `clamp(96px, 14vw, 180px)`; max content width 1120px; FAQ/prose capped at 720–820px for measure.
- **Product-as-illustration.** The hero preview card and dashboard mock ARE the imagery — no stock photos, no abstract blobs. The product's own UI is the premium illustration.
- **Comparison table scrolls horizontally on mobile** inside its own rounded container; the page body never scrolls sideways.
- **Native `<details>` accordion** for FAQ — fast, accessible, zero JS.
- **Buttons:** pill radius, white-on-black primary (inverted = maximum contrast in dark UI), bordered ghost secondary. `transform: scale(0.98)` on press.

---

## 5. Component List

| Component | Variants |
|---|---|
| NavBar | glass fixed; mobile (logo + CTA), desktop (+ anchor links) |
| Button | primary (inverted), secondary (ghost), nav-compact |
| Badge / Tag | dot badge, neutral tag, accent "Human Reviewed" tag |
| SectionHead | eyebrow + H2 + lede |
| RoadmapPreviewCard | header + 3 PriorityItems |
| ProblemCard | h3 + body |
| StepCard | icon + number + h3 + body (joined row on desktop) |
| ChecklistItem | accent check circle + title + description |
| DashboardShell | header + tag + card grid |
| StatCard | label + big value + subtext |
| ProgressBarRow | name + track/fill + percent |
| TimelineItem | dot (done/pending) + text + meta |
| CompareTable | highlighted Operator column, h-scroll wrapper |
| QuoteCard | quote + initials avatar + name/role |
| FAQItem | `<details>` with rotating "+" |
| PriceCard | standard + featured (accent border, floating tag) |
| FinalCTA | centered H2 + dual CTA |
| Footer | logo + links + disclaimer + copyright |

---

## 6. Color Palette

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0A0A0B` | Page background (near-black, warm) |
| `--bg-raised` | `#111113` | Cards, sections |
| `--bg-card` | `#16161A` | Nested cards, highlighted column |
| `--border` | `#26262B` | Default 1px borders |
| `--border-strong` | `#34343B` | Interactive borders, icons |
| `--text` | `#F5F5F7` | Headings, primary text |
| `--text-secondary` | `#A1A1AA` | Body copy |
| `--text-tertiary` | `#6E6E76` | Labels, dimmed headline spans |
| `--accent` | `#E8E4DC` | Signal only: review badges, progress, featured plan |

No gradients anywhere. No saturated colors. The accent is a *warm paper white* — premium, masculine-modern, zero fintech cliché.

---

## 7. Typography

- **Family:** Inter (self-hosted or Google Fonts), falling back to `-apple-system / SF Pro Display / Segoe UI`. One family for everything.
- **Scale:**
  - H1 `clamp(2.6rem, 8.5vw, 5.25rem)` / 600 / `-0.03em` / lh 1.08
  - H2 `clamp(2rem, 6vw, 3.5rem)` / 600 / `-0.03em`
  - H3 `~1.15–1.4rem` / 600 / `-0.02em`
  - Body `17px` / lh 1.6; small `0.88–0.98rem`
  - Eyebrows/labels `0.74–0.78rem` / 600 / uppercase / `+0.10–0.14em`
  - Stats `2–2.6rem` / 650 / `-0.03em`
- **Rules:** tight negative tracking on everything large; wide positive tracking on tiny uppercase labels; hierarchy via weight + color, never via extra fonts.

---

## 8. Icons

- **Style:** 24px-grid stroke icons, 1.8px weight, rounded caps/joins (Lucide/Feather style), inline SVG, `currentColor`.
- **Set used:** upload-arrow (Upload), plus-in-square (AI Analysis), person (Human Review), clock (Roadmap), checkmark (deliverables/pricing), custom square-in-rounded-square logo mark.
- **Never:** dollar signs, coins, rockets, charts-going-up, filled/duotone icons, emoji.

---

## 9. SEO

- **Title (58 chars):** `Operator — Know Exactly What to Do Next With Your Money`
- **Meta description (156 chars):** `Operator is an AI-assisted, human-reviewed financial operating system. Upload your numbers, get a personalized roadmap for what to do next — debt, home buying, saving, and your next 90 days.`
- **H1:** `Know exactly what to do next with your money.`
- **H2s:** clarity-problem statement · How-it-works · What's-included · Sample report · Why-Operator · Testimonials · FAQ · Pricing · Final CTA (all implemented in `index.html`)
- **Schema (implemented):** `Organization` + `Service` JSON-LD. **Recommended additions once live:** `FAQPage` (from the 20 FAQ items — high SERP real-estate value), `Product`/`Offer` once prices are final, `BreadcrumbList` when more pages exist. Avoid `Review`/`AggregateRating` markup until testimonials are real — placeholder reviews in schema risk a manual action.
- **Target queries:** "financial roadmap service", "which debt should I pay off first", "am I ready to buy a house", "financial plan not budgeting app" — each maps to an FAQ/section that can later become its own SEO page.

---

## 10. Conversion Recommendations

1. **One primary action everywhere.** "Start My Financial Reset" appears in nav, hero, featured plan, and final CTA — identical wording each time (message match builds trust).
2. **Secondary CTA de-risks.** "See a Sample Report" serves not-ready visitors; on the live site, gate the full sample behind an email for lead capture.
3. **Lead with human review.** It's the #1 objection-killer vs. AI chatbots — hence the badge above the H1, the "Human Reviewed ✓" tags, and its own comparison-table row.
4. **Show the product early.** The hero roadmap preview makes the abstract deliverable concrete within one scroll — specificity ("Kill the 24.9% card first") sells more than any adjective.
5. **Trust microcopy under CTAs:** what we never ask for (logins, account numbers), never-sold data,
   no investment products — placed at the moment of decision, not buried in the footer. Claim only what
   is actually true today; "bank-level encryption" was removed for exactly that reason.
6. **Comparison table as positioning:** each row rules out a category the visitor has already tried and been burned by.
7. **FAQ handles compliance objections honestly** ("Do you guarantee results? No — and be suspicious of anyone who does"), which reads as integrity and converts skeptics.
8. **Featured middle tier** with accent border + "Most Popular" tag for price anchoring; flat pricing framed as an incentive alignment ("our only incentive is to be right").
9. **Test next:** headline #1 vs. #11 ("Decent income. Zero traction.") — the pain-first variant may outperform for cold social traffic; sticky mobile CTA bar after 50% scroll; exit intent offering the sample report.

---

## 11. On the Name

The page is built as **Operator** per the brief. If a rename is on the table, the strongest candidates from the suggested list are **Reset** (already baked into the product language — "Start My Financial Reset" means the flagship product and the CTA become the same word) and **Waypoint** (owns the "roadmap/navigation" metaphor the whole page is built on). Everything in `index.html` is token-driven, so a rename is a find-and-replace plus a new logo mark.
