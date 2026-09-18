/* ============================================================================
   OPERATOR — shared page wiring for the sub-pages.
   Reads window.OPERATOR_CONFIG (config.js) and fills in anything marked with a
   data- attribute, so brand name, prices and legal text live in ONE file.
   ========================================================================== */
(function () {
  var cfg = window.OPERATOR_CONFIG || {};

  var DISCLAIMER =
    (cfg.brandName || "Operator") + " provides personalized financial analysis and education. " +
    (cfg.legalEntity || cfg.brandName || "Operator") + " is not a registered investment advisor, " +
    "broker-dealer, law firm, or accounting firm, and does not provide investment, legal, or tax advice. " +
    "We never guarantee financial results. When specialized advice is needed, we refer clients to vetted, " +
    "licensed professionals. Individual outcomes depend on your circumstances and your execution of the plan.";

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  /* Brand name anywhere it appears in copy */
  each("[data-brand]", function (el) { el.textContent = cfg.brandName || "Operator"; });

  /* Standard compliance disclaimer */
  each("[data-disclaimer]", function (el) { el.textContent = DISCLAIMER; });

  /* Contact email — as link text and href */
  each("[data-email]", function (el) {
    var m = cfg.contactEmail || "";
    el.textContent = m;
    if (el.tagName === "A") el.href = "mailto:" + m;
  });

  /* Prices: <span data-price="fullReset"></span> */
  each("[data-price]", function (el) {
    var p = (cfg.prices || {})[el.getAttribute("data-price")];
    if (!p) return;
    el.textContent = p.amount;
    if (p.note) {
      var s = document.createElement("small");
      s.textContent = p.note;
      el.appendChild(s);
    }
  });

  /* Turnaround: <span data-turnaround="fullReset"></span> */
  each("[data-turnaround]", function (el) {
    var t = (cfg.turnaround || {})[el.getAttribute("data-turnaround")];
    if (t) el.textContent = t;
  });

  /* Checkout links: <a data-checkout="fullReset">. Falls back to intake, then
     to the contact inbox — a CTA on this site is never a dead link. */
  each("[data-checkout]", function (el) {
    var plan = el.getAttribute("data-checkout");
    var link = (cfg.checkout || {})[plan];
    // No Stripe link yet: send them to the pricing section, which runs the
    // email capture. The intake form is the POST-payment step and is never a
    // checkout fallback.
    if (link) { el.href = link; }
    else { el.href = "index.html#pricing"; }
  });

  /* Sample report links */
  each("[data-sample]", function (el) { if (cfg.sampleReportUrl) el.href = cfg.sampleReportUrl; });

  /* Intake links */
  each("[data-intake]", function (el) { if (cfg.intakeFormUrl) el.href = cfg.intakeFormUrl; });

  /* Copyright year */
  each("[data-year]", function (el) { el.textContent = new Date().getFullYear(); });

  /* Plausible — only when a domain is configured */
  if (cfg.plausibleDomain) {
    var p = document.createElement("script");
    p.src = "https://plausible.io/js/script.js";
    p.defer = true;
    p.setAttribute("data-domain", cfg.plausibleDomain);
    document.head.appendChild(p);
  }
})();
