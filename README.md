# Operator — Landing Page

Two deployable pages, one design system, zero build step. Host either file on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

| File | What it is | Launch requirement |
|---|---|---|
| `mvp.html` | **Bare-bones launch page.** Hero, how it works, what you get, one plan, 6 FAQs, final CTA. | One Stripe Payment Link + an email address. Works today. |
| `index.html` | **Full page.** All 10 sections, 3 pricing tiers, sample dashboard, comparison table, 20 FAQs. Integration-ready for the complete stack. | Same as MVP; grows with you. |
| `DELIVERABLES.md` | Copy, wireframe, palette, typography, SEO, conversion notes. | — |

Both pages read a single `window.OPERATOR_CONFIG` block at the top of the file. **Every value is optional.** Anything left empty degrades gracefully — CTAs fall back to an email-capture waitlist modal, and chat/analytics simply don't load. No value in the config exposes a secret: everything here is a public URL or public site ID, safe to commit.

---

## Launch the MVP (day one)

1. **Deploy `mvp.html`** as your index page on any static host.
2. **Stripe** → create account → *Payment Links* → new link for "The Financial Reset" at your price → paste the URL into `checkoutUrl` in `mvp.html`. Every CTA on the page now goes to checkout.
3. Set `contactEmail` to your real address (waitlist fallback).
4. Update the `$XXX` price text in the pricing card.

That's a functioning business: Stripe checkout → Stripe's post-payment redirect can point to a Google-Drive-shared intake doc or a Typeform until the real intake exists.

**Optional, 10 minutes each:**
- **Formspree** (free tier) → create a form → paste endpoint into `emailFormEndpoint`. Waitlist emails now land in a dashboard instead of mailto.
- **Plausible** → add your domain → paste it into `plausibleDomain`.
- **Crisp** (free tier) → paste your Website ID into `crispWebsiteId` for live chat.

## Activate the full stack (`index.html`)

Same config pattern, more slots. Fill them in any order as accounts get created:

| Config key | Service | Where to get it |
|---|---|---|
| `checkout.snapshot` / `.fullReset` / `.resetReview` | Stripe | Dashboard → Payment Links (one per plan; use a recurring price for Reset + Review) |
| `intakeFormUrl` | Typeform / Fillout | The form's public share URL. Used as checkout fallback and post-payment destination |
| `sampleReportUrl` | anywhere | Hosted PDF or page. "See a Sample Report" buttons link straight to it; while empty they run email capture instead (lead gen) |
| `emailFormEndpoint` | Formspree / Loops | POST endpoint receiving `{email, interest}` — `interest` tells you which plan or CTA they came from |
| `crispWebsiteId` | Crisp | app.crisp.chat → Settings → Setup instructions. Train Crisp's AI bot on the FAQ section |
| `plausibleDomain` | Plausible | Your site domain as registered in Plausible |

**Behavior matrix for the pricing CTAs:** Stripe link set → checkout. No Stripe link but `intakeFormUrl` set → intake form. Neither → waitlist modal (captures email + which plan they clicked).

## Not wired into the page (by design)

These belong to the fulfillment side, not the landing page:

- **Document intake** (Content Snare → later Plaid): link it from your post-payment flow / Stripe confirmation redirect, not from the public page.
- **Report delivery** (Postmark/Resend): transactional email, server-side.
- **E-signature** (Dropbox Sign): send the client agreement as part of onboarding.
- **Scheduling** (Cal.com): link it from the Reset + Review confirmation email.
- **Pipeline** (Notion/Airtable): internal.

## Editing notes

- Design tokens live in `:root` at the top of each file's `<style>` — palette and radii changes are one-line edits.
- Prices are the `$XX` / `$XXX` placeholders in the pricing sections.
- A rename (e.g. to "Reset") is a find-and-replace on "Operator" plus the `logo-mark` styles.
