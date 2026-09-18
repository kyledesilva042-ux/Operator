# Launch Runbook

Everything here is written to be done in one morning. The site is finished; what's left is plumbing, and then the only part that actually matters — talking to people.

**Read this first:** the website is not the bottleneck. It was never the bottleneck. You can be taking payments in about three hours, and then your revenue tomorrow depends entirely on how many real humans you personally put in front of it. Plan the morning for setup and the afternoon for outreach, not the other way around.

---

## Before you start: two decisions

1. **Your price.** The site ships at **$29** for the instant review and **$199** for human review. The $29 is deliberately an impulse buy — low enough that nobody has to think about it, which is the entire point when nobody has heard of you. The margin is in the upgrade. Change `prices` in `config.js` and create your Stripe links at matching amounts.
2. **Your name and inbox.** A Gmail address works for day one. `hello@yourdomain.com` works better and takes ten minutes once you own a domain.

---

## Hour 1 — Get paid

### 1. Stripe (30 min)

You need **two** Payment Links.

1. Create an account at stripe.com. Use your legal name / LLC if you have one; a US sole proprietorship with your SSN is fine to start.
2. **Payment Links → New link → One-off product.**

   **Link A — Instant Review**
   - Name: `Instant Review` · Price: `$29`
   - Description: "Your complete financial position, computed and on screen in about ten minutes."
   - **After payment → Redirect customers to a page you host:** `https://yourdomain.com/thanks.html`
   - Paste the URL into `checkout.instant` in `config.js`

   **Link B — Human Review & Planning**
   - Name: `Human Review & Planning` · Price: `$199`
   - Description: "A person reads your complete picture and answers the decision you're actually facing."
   - **Redirect to:** `https://yourdomain.com/thanks.html?upgrade=1`  ← the `?upgrade=1` matters; it switches the page to the right message
   - Paste the URL into `checkout.humanReview` in `config.js`

**The redirects are the step everyone forgets, and they're the step that makes the whole thing work.** `thanks.html` is what records the payment in the customer's browser and unlocks the intake. Without it they pay and hit a wall.

> **Expect a Stripe review.** Financial-services businesses often get flagged for a short verification. They want a working website with visible terms, a refund policy, and a real contact address — which is exactly why `legal.html` exists. Deploy before you apply, and answer their questions the same day. Also: your first payout typically lands **2–7 days** after your first charge, not instantly.

### About the paywall — read this before you launch

`intake.html` checks for a flag that `thanks.html` sets after checkout. **This is a courtesy gate, not access control.** Anyone who knows how to open a browser console or type a URL can skip it. That's a deliberate day-one tradeoff: real gating needs a server, and a server needs to exist before it can be written.

It's fine, and here's why: the people who bypass a $29 paywall were never going to pay $29. It costs you nothing per report, and it will not lose you meaningful revenue.

**When you want real verification** (worth doing once you're past a few dozen sales): add a Netlify/Vercel function that takes the `session_id` Stripe appends to your redirect URL, calls `stripe.checkout.sessions.retrieve()` with your **secret** key server-side, and returns a signed token the intake checks. Roughly 40 lines. Your secret key must never appear in `config.js` or anywhere else in this repo.

### 2. Formspree (10 min, free)
Create **two** forms at formspree.io:
- One for waitlist / sample-report emails → paste into `emailFormEndpoint`
- One for client intakes → paste into `intakeFormEndpoint`

Skip this and the intake page still works — it shows the client a formatted summary and a "copy my answers" button that emails it to you. Uglier, entirely functional.

### 3. Fill in the rest of `config.js` (5 min)
`contactEmail`, `brandName`, `legalEntity`, `siteUrl`. Then open `legal.html` and replace the `[add your business mailing address here]` line.

---

## Hour 2 — Get online

**Fastest path (5 minutes, free):** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this entire folder onto the page. You get a live URL immediately. Done.

**Better path (20 minutes):** connect this repo to Netlify or Vercel so every push deploys itself. Both auto-detect the config in `netlify.toml` / `vercel.json`. No build command, no framework.

**Domain (15 min, ~$12/yr):** buy one at Namecheap or Cloudflare and point it at your host. `.com` if you can get it. Then:
- Go back to your Stripe Payment Link and set the redirect to `https://yourdomain.com/thanks.html`
- Find-and-replace `example.com` in `robots.txt` and `sitemap.xml`

### Test the whole path before you tell anyone
Use Stripe's test mode, or buy from yourself and refund it:

- [ ] Homepage loads, prices show your real numbers
- [ ] "Get my review" → Stripe checkout opens
- [ ] Pay → lands on `/thanks.html`
- [ ] "Start my intake" → `/intake.html` opens (the paywall is satisfied)
- [ ] Fill the intake **with your own real numbers** on your **phone**
- [ ] Submit → the report renders immediately, and the figures are right
- [ ] Check the math yourself against a calculator on at least one client
- [ ] "Save as PDF" produces a clean document
- [ ] The $199 upgrade button at the bottom opens the second Stripe link
- [ ] That link redirects to `/thanks.html?upgrade=1` and shows the upgrade message
- [ ] The intake copy reaches your Formspree inbox
- [ ] Every footer link goes somewhere real

---

## Hour 3 — Get customers

This is the whole job. A site with no traffic earns nothing, and no amount of design fixes that.

### Where your first five come from
Not ads. Not SEO — that's a six-month instrument. Your first clients are people who already trust you, and people in rooms where your exact problem gets discussed daily.

1. **Your phone's contact list.** Ten people you know who have decent income and no plan. You already know who they are.
2. **The sample report is your pitch.** Don't sell the service, send the artifact. "I built this — tell me if it's useful" gets read; "I started a business" gets ignored.
3. **Communities where the question already gets asked.** r/personalfinance, r/MiddleClassFinance, r/povertyfinance, local Facebook groups, your alumni Slack, Discord servers for your industry. **Answer questions for free, thoroughly, for a week.** Put the link in your profile, not in the comment. Nothing gets you banned faster than dropping a sales link, and nothing builds trust faster than being visibly, uncompensated-ly useful.
4. **One post on your own feed.** LinkedIn, Instagram, wherever you actually have people.

### The DM (adapt, don't paste verbatim)

> Hey — I've started doing financial analysis for people: you send me your numbers, I send back a written breakdown of where you actually stand and exactly what to do for the next 90 days. Not budgeting, not coaching, no products.
>
> Here's a full sample so you can see the real thing: [link]
>
> I'm doing the first five at $149 to build up reviews. Want one? And if it's not for you, I'd genuinely take a "here's why not."

### The public post

> Most people aren't bad with money. They just have no map.
>
> I spent [time] building one: you send your numbers, you get back a written analysis — position score, where your money is leaking, the exact order to kill your debts, and a 90-day plan. A person reads every one before it goes out.
>
> Here's a complete sample report so you can judge it yourself: [link]
>
> First five are $149 while I build up reviews. Comment or DM.

### What the funnel actually does for you

At $29 the instant review is not really the business — it's the thing that turns a stranger into a customer for the price of a sandwich, and hands them a document with your name on it that is genuinely useful. Some fraction upgrade. Some tell a friend. All of them have now seen your work instead of your marketing.

So optimize for **volume into the $29**, not for conversion to $199. Ten instant reviews beats one nagging email about a $199 upgrade, every time.

### A realistic day one
Twenty real conversations → two or three genuinely interested → **one sale is a good day.** One sale is not a small thing: it's proof the whole loop works, plus a testimonial, plus a person who talks about you. Ten DMs and zero sales isn't failure either — it's a signal to fix the pitch or change the room. Keep going for a week before you conclude anything.

---

## Fulfillment: the instant tier delivers itself

That's the point of it. `assets/engine.js` computes the review in the customer's browser: no server, no API key, nothing for you to do, and zero marginal cost per sale. You could sell a hundred tonight while asleep.

**What it does:** real cash flow, a position score with every component broken out, leak detection with dollar figures, debt payoff ordering with a month-by-month simulation of interest and time saved, employer-match and tax-withholding checks, a sequenced 90-day plan, and referral flags for anything needing a licensed professional.

**What it deliberately does not do:** exercise judgment, ask a follow-up question, or weigh two goals against each other. The report says so plainly in Section 8, which is also where the upgrade sits. That honesty *is* the sales pitch — don't soften it.

## Fulfillment: how you deliver human review

About 90 minutes per client.

1. **Open their intake.** It arrives in your Formspree inbox with a readable summary, and their instant review already tells you the arithmetic. You're not starting from a blank page — you're starting from a finished analysis that needs judgment added.
2. **Copy `sample-report.html`** to `report-clientname.html`. That's your template; the structure and voice are already decided.
3. **Answer their actual question in Section 1**, plainly, in the first two sentences. Even when the answer is "not yet, and here's when."
4. **Find the things the engine couldn't.** This is what they paid $199 for. What did the form not ask? What did they mention in the free-text boxes that changes the picture? Where are two of their goals in conflict?
5. **Write Section 5 — what you're NOT doing.** It's what makes you sound like a professional rather than a blog, and it's where you protect them from being sold something.
6. **Say when it's out of your lane.** Wills, taxes, student-loan forgiveness → refer out, take no fee.
7. **Read it out loud once**, print to PDF, email it. That read-aloud pass is the human review you advertised. Actually do it.

Then: wait two weeks and email one line — *"How's week two going?"* That's where referrals come from.

## Before you scale past five clients

None of this blocks tomorrow. All of it matters by month two.

- **Form an LLC** (~$100–500 by state) and get an EIN (free, irs.gov). Separates your personal assets from the business.
- **Have a lawyer read `legal.html`.** It's a solid starting point written to match how this service actually runs, but it isn't legal advice and financial-services rules vary by state. This is a few hundred dollars well spent.
- **Know where the line is.** You're selling analysis and education. The moment you recommend specific securities, manage anyone's money, or take a commission, you're in registered-advisor territory. The site's disclaimers say this; make sure your delivery matches them.
- **Never take a login or an SSN.** The intake form is deliberately built so a breach of your records couldn't move anyone's money. Keep it that way — it's a real security posture and a genuine selling point.
- **Business bank account** so Stripe deposits don't mix with your rent.
- **Set aside ~30% for taxes** from day one.

---

## Config reference

Every value the site reads lives in `config.js`. The only two required to take money:

| Key | Why |
|---|---|
| `checkout.instant` | Your $29 Stripe Payment Link. Without it, CTAs collect emails instead. |
| `contactEmail` | Where everything falls back to. |

And one you'll want within a day: `checkout.humanReview`, the $199 link sold from the bottom of every generated report.

Everything else degrades gracefully. Empty analytics means no analytics, not a broken page.

| File | What it's for |
|---|---|
| `index.html` | Full marketing site |
| `mvp.html` | Stripped-down one-page version (swap it in as your index if the long page feels premature) |
| `report.html` | The generated instant review — your actual $29 product |
| `assets/engine.js` | The analysis engine. All the math lives here. |
| `sample-report.html` | Example of the $199 human report; also your fulfillment template |
| `intake.html` | Post-payment questionnaire that feeds the engine |
| `thanks.html` | Stripe's redirect target — records payment, sends buyers to the intake |
| `legal.html` | Terms, privacy, refunds, disclosures. Stripe will look for this. |
| `config.js` | Every setting, one file |
