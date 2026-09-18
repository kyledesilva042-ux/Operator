/* ============================================================================
   OPERATOR — SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Every page on this site reads this file. Edit it here, edit it once.
   Nothing in this file is a secret: every value is a public URL, a public
   site ID, or a price you already display. Safe to commit.

   THE FLOW:
     index.html → Stripe ($29) → thanks.html → intake.html → report.html
                                                              └→ Stripe ($199)

   TO LAUNCH YOU NEED EXACTLY TWO THINGS:
     1. checkout.instant  — one Stripe Payment Link
     2. contactEmail      — an address you actually read
   Everything else degrades gracefully when left empty. See LAUNCH.md.
   ========================================================================== */
window.OPERATOR_CONFIG = {

  /* --- Business identity ------------------------------------------------ */
  brandName:    "Operator",
  siteUrl:      "",                      // "https://useoperator.com"
  contactEmail: "hello@example.com",     // REQUIRED. Real inbox you check daily.

  /* --- Stripe Payment Links ---------------------------------------------
     Stripe Dashboard → Payment Links → New → copy the buy.stripe.com URL.
     Set the INSTANT link's post-payment redirect to:
         <your-domain>/thanks.html
     Set the HUMAN REVIEW link's redirect to:
         <your-domain>/thanks.html?upgrade=1                                */
  checkout: {
    instant:     "",                     // REQUIRED to take money. $29 tier.
    humanReview: ""                      // The $199 upgrade, sold from report.html.
  },

  /* --- Prices (display only; Stripe is the source of truth for charges) -- */
  prices: {
    instant:     { amount: "$29",  note: "" },
    humanReview: { amount: "$199", note: "" }
  },

  /* --- Delivery promises ------------------------------------------------- */
  turnaround: {
    instant:     "instantly, on screen",
    humanReview: "5 business days"
  },

  /* --- Pages ------------------------------------------------------------- */
  /* POST-PAYMENT questionnaire. Never used as a checkout fallback. */
  intakeFormUrl:   "intake.html",
  reportUrl:       "report.html",         // where the generated review renders
  sampleReportUrl: "sample-report.html",  // the human-review example

  /* --- Optional integrations (10 minutes each, all free tiers) ----------- */
  emailFormEndpoint:  "",  // Formspree: waitlist + sample capture
  intakeFormEndpoint: "",  // Formspree: a SECOND form, for intake submissions
  crispWebsiteId:     "",  // app.crisp.chat → Settings → Setup
  plausibleDomain:    "",  // "useoperator.com"

  /* --- Legal ------------------------------------------------------------- */
  legalEntity:   "Operator",
  refundWindow:  "14 days",
  jurisdiction:  "the United States"
};
