# Operator

A complete, static, zero-build business website: marketing site, sample deliverable, client intake, post-payment flow, and legal pages. Host the folder anywhere. Edit one config file.

**→ To launch, read [`LAUNCH.md`](LAUNCH.md).** It's a three-hour runbook.

---

## What's here

| File | What it is |
|---|---|
| `index.html` | The full marketing site — 10 sections, 3 plans, comparison table, 20 FAQs. |
| `mvp.html` | A stripped-down one-pager. Swap it in as your index if the long page feels premature. |
| `sample-report.html` | A complete sample deliverable. Your strongest sales asset **and** the template you copy for each client. |
| `intake.html` | The post-payment client questionnaire. Five steps, saves progress, works without any third-party service. |
| `thanks.html` | Where Stripe sends buyers. Routes them into the intake. |
| `legal.html` | Terms, privacy, refunds, regulatory disclosure. Payment processors ask for this. |
| `404.html` | — |
| `config.js` | **Every setting on the site.** One file. |
| `assets/site.css`, `assets/site.js` | Shared styles and wiring for the sub-pages. |
| `netlify.toml`, `vercel.json` | Deploy config for either host. No build step. |
| `DELIVERABLES.md` | Copy variants, wireframes, palette, typography, SEO notes. |

## The two values you need

Everything in `config.js` is optional except these:

```js
checkout:     { fullReset: "https://buy.stripe.com/..." },  // to take money
contactEmail: "you@yourdomain.com"                          // where everything falls back
```

Leave anything else empty and it degrades quietly: no Stripe link → CTAs capture emails; no form endpoint → the intake shows a copy-and-email summary; no analytics key → no analytics script loads. Nothing in `config.js` is a secret — every value is a public URL or a public site ID, safe to commit.

## How the money path works

```
index.html  →  Stripe Payment Link  →  thanks.html  →  intake.html  →  your inbox
                                       (set as Stripe's post-payment redirect)
```

Set that redirect in Stripe. It's the one step that connects a payment to a client you can actually serve.

## Deploying

Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) for an instant URL, or connect the repo to Netlify or Vercel for push-to-deploy. There is no build command and no framework.

## Editing

- **Prices** → `config.js` → `prices`. They render everywhere automatically.
- **Design tokens** → `:root` at the top of `assets/site.css` (and inside `index.html` / `mvp.html`, which stay deliberately self-contained so either can be hosted as a single file).
- **Renaming the business** → `brandName` in `config.js` covers the sub-pages; `index.html` and `mvp.html` need a find-and-replace on "Operator".

## A note on what this business is

Operator sells written financial analysis and education. It is not registered investment advice, and the site's disclaimers say so. Keep your delivery matching them: don't recommend specific securities, don't manage anyone's money, don't take commissions, and refer out to licensed professionals for tax, legal, and estate questions. `legal.html` is a working starting point written to match how this service actually runs — it is not legal advice, and a lawyer in your state should read it before you scale.

The intake form deliberately never asks for logins, account numbers, or SSNs. That's a real security posture and a real selling point. Don't erode it.
