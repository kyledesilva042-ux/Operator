# Operator

A complete, static, zero-build business website: marketing site, sample deliverable, client intake, post-payment flow, and legal pages. Host the folder anywhere. Edit one config file.

**→ To launch, read [`LAUNCH.md`](LAUNCH.md).** It's a three-hour runbook.

---

## What's here

| File | What it is |
|---|---|
| `index.html` | The marketing site — two tiers, comparison table, FAQs. |
| `mvp.html` | A stripped-down one-pager. Swap it in as your index if the long page feels premature. |
| `assets/engine.js` | **The analysis engine.** All the math: cash flow, position score, leak detection, debt payoff simulation, the 90-day plan. Pure functions, no network. |
| `report.html` | The generated instant review — the $29 product. Renders `engine.js` output and sells the upgrade at the bottom. |
| `intake.html` | Post-payment questionnaire. Five steps, saves progress, feeds the engine. |
| `thanks.html` | Where Stripe sends buyers. Records the payment and routes them into the intake. |
| `sample-report.html` | Example of the $199 human report. Also the template you copy per client. |
| `legal.html` | Terms, privacy, refunds, regulatory disclosure. Payment processors ask for this. |
| `404.html` | — |
| `config.js` | **Every setting on the site.** One file. |
| `assets/site.css`, `assets/report.css`, `assets/site.js` | Shared styles and wiring. |
| `netlify.toml`, `vercel.json` | Deploy config for either host. No build step. |
| `DELIVERABLES.md` | Copy variants, wireframes, palette, typography, SEO notes. |

## The two values you need

Everything in `config.js` is optional except these:

```js
checkout:     { instant: "https://buy.stripe.com/..." },  // to take money
contactEmail: "you@yourdomain.com"                        // where everything falls back
```

Leave anything else empty and it degrades quietly: no Stripe link → CTAs capture emails; no form endpoint → the intake shows a copy-and-email summary; no analytics key → no analytics script loads. Nothing in `config.js` is a secret — every value is a public URL or a public site ID, safe to commit.

## How the money path works

```
index.html → Stripe ($29) → thanks.html → intake.html → report.html
                            (Stripe's         (records      (generated
                             redirect          payment)      instantly)
                             target)                             │
                                                                 ▼
                                              Stripe ($199) → thanks.html?upgrade=1
```

Set both redirects in Stripe. They're the steps that connect a payment to a product the customer can actually reach.

**The instant review costs you nothing to deliver.** `engine.js` computes it in the customer's browser — no server, no API key, no per-report cost. It also cannot invent a number: every figure traces back to something the customer typed. That property is what makes it honest to sell as instant, and it's why the report says plainly that no person has read it. Judgment is what the $199 tier sells; keep that line where it is.

## Deploying

Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) for an instant URL, or connect the repo to Netlify or Vercel for push-to-deploy. There is no build command and no framework.

## Editing

- **Prices** → `config.js` → `prices`. They render everywhere automatically.
- **The analysis logic** → `assets/engine.js`. Every threshold and rule is commented with why it's set where it is.
- **Design tokens** → `:root` at the top of `assets/site.css` (and inside `index.html` / `mvp.html`, which stay deliberately self-contained so either can be hosted as a single file).
- **Renaming the business** → `brandName` in `config.js` covers the sub-pages; `index.html` and `mvp.html` need a find-and-replace on "Operator".

## A note on what this business is

Operator sells written financial analysis and education. It is not registered investment advice, and the site's disclaimers say so. Keep your delivery matching them: don't recommend specific securities, don't manage anyone's money, don't take commissions, and refer out to licensed professionals for tax, legal, and estate questions. `legal.html` is a working starting point written to match how this service actually runs — it is not legal advice, and a lawyer in your state should read it before you scale.

The intake form deliberately never asks for logins, account numbers, or SSNs. That's a real security posture and a real selling point. Don't erode it.
