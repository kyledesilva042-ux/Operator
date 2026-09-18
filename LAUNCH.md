# Launch Runbook

Everything here is written to be done in one morning. The site is finished; what's left is plumbing, and then the only part that actually matters — talking to people.

**Read this first:** the website is not the bottleneck. It was never the bottleneck. You can be taking payments in about three hours, and then your revenue tomorrow depends entirely on how many real humans you personally put in front of it. Plan the morning for setup and the afternoon for outreach, not the other way around.

---

## Before you start: two decisions

1. **Your price.** The site ships at $149 / $349 / $249-per-quarter. For your first five clients, consider a **founding price of $149 for the Full Reset** — you want reviews, testimonials, and reps more than you want $349 right now. Change `prices` in `config.js` and create your Stripe link at the matching amount.
2. **Your name and inbox.** A Gmail address works for day one. `hello@yourdomain.com` works better and takes ten minutes once you own a domain.

---

## Hour 1 — Get paid

### 1. Stripe (25 min)
1. Create an account at stripe.com. Use your legal name / LLC if you have one; a sole proprietorship with your SSN is fine to start in the US.
2. **Payment Links → New link → One-off product.**
   - Name: `The Full Reset` · Price: your number · Description: "A complete, human-reviewed analysis of your financial position with a 90-day action plan."
   - Under **After payment → Redirect customers to a page you host**, set: `https://yourdomain.com/thanks.html`
     *(You'll have the URL after Hour 2 — come back and fill it in. This is the step everyone forgets, and it's the one that gets clients into your intake form.)*
3. Copy the `buy.stripe.com/...` URL into `checkout.fullReset` in `config.js`.
4. Repeat for the other two plans if you want all three live. **You don't need to.** One product sells better than three when nobody knows you yet.

> **Expect a review.** Stripe often flags financial-services businesses for a short verification. They ask for a working website with visible terms, a refund policy, and a real contact address — which is exactly why `legal.html` exists. Deploy before you apply, and answer their questions the same day. Also: your first payout typically lands **2–7 days** after your first charge, not instantly. The sale happens tomorrow; the deposit follows.

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
- [ ] "Start My Financial Reset" → Stripe checkout opens
- [ ] Pay → lands on `/thanks.html`
- [ ] "Fill out my intake" → `/intake.html` works on your **phone**
- [ ] Submit the intake → it reaches your inbox
- [ ] Sample report reads well and prints to PDF cleanly
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

### A realistic day one
Twenty real conversations → two or three genuinely interested → **one sale is a good day.** One sale is not a small thing: it's proof the whole loop works, plus a testimonial, plus a person who talks about you. Ten DMs and zero sales isn't failure either — it's a signal to fix the pitch or change the room. Keep going for a week before you conclude anything.

---

## Fulfillment: how you actually deliver

You promised a report. Here's how to produce one in about 90 minutes.

1. **Copy `sample-report.html`** to `report-clientname.html`. That file is your template — the structure, the order, and the voice are all already decided. You're filling in numbers and writing four or five paragraphs of judgment.
2. **Work the intake in this order.** Income → fixed costs → what's cuttable → debts sorted by rate → the one question they asked. The report is organized in that order because the analysis is.
3. **Find at least three specific things.** Not "spend less on food" — *"$180/month in subscriptions you listed as 'not sure what that is.'"* Specificity is the entire product. Vague advice is what they already had for free.
4. **Answer their actual question in Section 1**, plainly, in the first two sentences. Even when the answer is "not yet, and here's when."
5. **Write Section 5 — what you're NOT doing.** It's the section that makes you sound like a professional instead of a blog. It's also where you protect them from getting sold something.
6. **Say when it's out of your lane.** Wills, taxes, student loan forgiveness → refer out, take no fee. This keeps you on the right side of the line *and* is the thing clients tell their friends about.
7. **Read it out loud once**, print to PDF, email it. That read-aloud pass is the "human review" you advertised. Actually do it.

Then: wait two weeks, email them one line — *"How's week two going?"* That email is where your repeat revenue and your referrals come from.

---

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
| `checkout.fullReset` | Your Stripe Payment Link. Without it, CTAs collect emails instead. |
| `contactEmail` | Where everything falls back to. |

Everything else degrades gracefully. Empty analytics means no analytics, not a broken page.

| File | What it's for |
|---|---|
| `index.html` | Full marketing site |
| `mvp.html` | Stripped-down one-page version (swap it in as your index if the long page feels premature) |
| `sample-report.html` | Your best sales asset **and** your fulfillment template |
| `intake.html` | Post-payment client questionnaire |
| `thanks.html` | Stripe's redirect target — sends buyers to the intake |
| `legal.html` | Terms, privacy, refunds, disclosures. Stripe will look for this. |
| `config.js` | Every setting, one file |
