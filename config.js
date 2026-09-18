/* ============================================================================
   OPERATOR — SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Every page on this site reads this file. Edit it here, edit it once.
   Nothing in this file is a secret: every value is a public URL, a public
   site ID, or a price you already display. Safe to commit.

   TO LAUNCH YOU NEED EXACTLY TWO THINGS:
     1. checkout.fullReset  — one Stripe Payment Link
     2. contactEmail        — an address you actually read
   Everything else degrades gracefully when left empty. See LAUNCH.md.
   ========================================================================== */
window.OPERATOR_CONFIG = {

  /* --- Business identity ------------------------------------------------ */
  brandName:    "Operator",
  siteUrl:      "",                      // "https://useoperator.com" — used in emails/sitemap copy
  contactEmail: "hello@example.com",     // REQUIRED. Real inbox you check daily.

  /* --- Stripe Payment Links --------------------------------------------- */
  /* Stripe Dashboard → Payment Links → New → copy the buy.stripe.com URL.
     Set each link's post-payment redirect to:  <your-domain>/thanks.html     */
  checkout: {
    snapshot:    "",
    fullReset:   "",                     // REQUIRED to take money.
    resetReview: ""
  },

  /* --- Prices (display only; Stripe is the source of truth for charges) -- */
  prices: {
    snapshot:    { amount: "$149", note: ""          },
    fullReset:   { amount: "$349", note: ""          },
    resetReview: { amount: "$249", note: "/quarter"  }
  },

  /* --- Delivery promises (shown on the site AND in the intake flow) ------ */
  turnaround: {
    snapshot:  "2 business days",
    fullReset: "5 business days"
  },

  /* --- Pages ------------------------------------------------------------- */
  /* POST-PAYMENT questionnaire. Never used as a checkout fallback. */
  intakeFormUrl:   "intake.html",         // self-hosted. Swap for a Typeform URL if you prefer.
  sampleReportUrl: "sample-report.html",  // real sample. Also your fulfillment template.

  /* --- Optional integrations (10 minutes each, all free tiers) ----------- */
  emailFormEndpoint: "",   // Formspree: "https://formspree.io/f/xxxxxxx" — waitlist + sample capture
  intakeFormEndpoint: "",  // Formspree: a SECOND form, for client intake submissions
  crispWebsiteId:    "",   // app.crisp.chat → Settings → Setup
  plausibleDomain:   "",   // "useoperator.com"

  /* --- Legal ------------------------------------------------------------- */
  legalEntity:   "Operator",   // Your LLC / sole-prop name as it appears on the Stripe receipt
  refundWindow:  "14 days",
  jurisdiction:  "the United States"
};
