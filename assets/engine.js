/* ============================================================================
   OPERATOR — ANALYSIS ENGINE
   ----------------------------------------------------------------------------
   Pure functions. Takes the intake answers, returns a fully computed report.
   No network, no API key, no per-report cost, and it cannot invent a number:
   every figure below is arithmetic on something the client typed.

   That property is the whole reason this tier can be sold as "instant" and
   still be honest. Judgment — what to do about a messy situation, what the
   client didn't say, what the numbers mean in context — is what the human
   review tier sells. Keep that line where it is.

   analyze(intake) -> report object consumed by report.html
   ========================================================================== */
(function (root) {
  "use strict";

  /* ---------- helpers ---------- */
  var num = function (v) { var n = parseFloat(v); return isFinite(n) ? n : 0; };
  var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
  var round = function (v) { return Math.round(v); };
  var money = function (v) {
    return "$" + Math.round(v).toLocaleString("en-US");
  };
  var pct = function (v) { return Math.round(v * 100) + "%"; };

  /* ---------- 1. cash flow ---------- */
  function cashFlow(d) {
    var income = num(d.income_monthly) + num(d.income_partner);
    var costs = {
      housing:   num(d.cost_housing),
      utilities: num(d.cost_utilities),
      food:      num(d.cost_food),
      transport: num(d.cost_transport),
      insurance: num(d.cost_insurance),
      childcare: num(d.cost_childcare),
      other:     num(d.cost_other)
    };
    var fixed = 0;
    for (var k in costs) fixed += costs[k];
    var debtMin = (d.debts || []).reduce(function (s, x) { return s + num(x.min); }, 0);
    var out = fixed + debtMin;
    return {
      income: income,
      costs: costs,
      fixed: fixed,
      debtMin: debtMin,
      out: out,
      free: income - out,
      savingsRate: income > 0 ? (income - out) / income : 0,
      housingRatio: income > 0 ? costs.housing / income : 0,
      foodRatio: income > 0 ? costs.food / income : 0,
      dti: income > 0 ? debtMin / income : 0
    };
  }

  /* ---------- 2. recoverable money ----------
     Every rule is conservative on purpose: a plan that asks for sainthood
     fails in week three, and an over-promised number destroys trust the
     moment the client tries to hit it. */
  function findLeaks(d, cf) {
    var out = [];

    // Subscriptions the client themselves flagged as unused. 100% recoverable.
    var unsure = num(d.subs_unsure);
    if (unsure > 0) {
      out.push({
        key: "subs",
        title: "Subscriptions you're not sure you use",
        monthly: unsure,
        annual: unsure * 12,
        confidence: "high",
        body: "You told us " + money(unsure) + " a month is going to things you weren't sure you still use. " +
              "That's " + money(unsure * 12) + " a year, and it is the cheapest money you will ever find — " +
              "no lifestyle change, no discipline, one sitting with your card statement."
      });
    }

    // Food, only if meaningfully above a sane share of income.
    if (cf.income > 0 && cf.foodRatio > 0.15 && cf.costs.food > 0) {
      var target = cf.income * 0.12;
      var freed = Math.min(cf.costs.food - target, cf.costs.food * 0.25);
      if (freed >= 40) {
        out.push({
          key: "food",
          title: "Groceries and eating out",
          monthly: freed,
          annual: freed * 12,
          confidence: "medium",
          body: money(cf.costs.food) + " a month is " + pct(cf.foodRatio) + " of your take-home — above the " +
                "12–15% where this line usually sits. We're not asking you to stop eating out. We're asking for " +
                money(freed) + " back, which is a handful of takeout nights. This is almost always a planning " +
                "problem rather than a discipline problem."
        });
      }
    }

    // Insurance re-shop. Real, verifiable, and usually ignored.
    if (cf.costs.insurance >= 120) {
      var ins = cf.costs.insurance * 0.2;
      out.push({
        key: "insurance",
        title: "Insurance you haven't re-priced",
        monthly: ins,
        annual: ins * 12,
        confidence: "medium",
        body: "You're paying " + money(cf.costs.insurance) + " a month. Rates drift upward on autopilot and " +
              "carriers reserve their best pricing for new customers. Getting three quotes and asking your " +
              "current carrier to match typically recovers 15–25% — roughly " + money(ins) + " a month here. " +
              "Budget 30 minutes."
      });
    }

    return out;
  }

  /* ---------- 3. employer match ----------
     Almost always the highest-return line in the whole report, and the only
     reason to send money anywhere other than high-interest debt. */
  function matchGap(d, cf) {
    var gross = num(d.income_gross_annual);
    var contrib = num(d.retirement_contrib_pct) / 100;
    var match = num(d.employer_match_pct) / 100;
    if (gross <= 0 || match <= 0) return null;

    var capturing = Math.min(contrib, match) * gross;
    var available = match * gross;
    var missed = available - capturing;
    if (missed < 120) return null;

    var costMonthly = (match - contrib) * gross / 12;
    return {
      missedAnnual: missed,
      missedMonthly: missed / 12,
      costMonthly: costMonthly,
      costAfterTax: costMonthly * 0.8,
      body: "Your employer matches " + pct(match) + " and you're contributing " + pct(contrib) + ". " +
            "You are declining " + money(missed) + " a year in money that is already yours. Raising your " +
            "contribution to " + pct(match) + " costs about " + money(costMonthly) + " a month in take-home " +
            "(closer to " + money(costMonthly * 0.8) + " after the tax deduction) and returns " +
            money(missed / 12) + " a month immediately. Nothing else in this report returns 100% on day one."
    };
  }

  /* ---------- 4. tax withholding ---------- */
  function refundDrag(d) {
    var r = num(d.tax_refund);
    if (r < 1200) return null;
    return {
      annual: r,
      monthly: r / 12,
      body: "You received a " + money(r) + " refund last year. A refund isn't a windfall — it's your own money " +
            "coming back after you lent it to the government interest-free all year, about " + money(r / 12) +
            " a month. Adjusting your W-4 moves most of that into your paycheck now, where this plan can use it. " +
            "Confirm the new number with a CPA before you change it."
    };
  }

  /* ---------- 5. debt sequence ----------
     Highest rate first, smallest balance breaks ties. 0% always last: every
     dollar sent to a 0% balance is a dollar not killing a 24% one. */
  function orderDebts(debts) {
    return debts.slice().sort(function (a, b) {
      var ra = num(a.rate), rb = num(b.rate);
      if (ra === 0 && rb !== 0) return 1;
      if (rb === 0 && ra !== 0) return -1;
      if (rb !== ra) return rb - ra;
      return num(a.balance) - num(b.balance);
    });
  }

  /* Month-by-month simulation. Minimums on everything, every spare dollar at
     the target, freed minimums roll forward. Returns months-to-zero per debt
     and total interest paid. */
  function simulate(debts, extra) {
    var list = debts.map(function (x) {
      return { name: x.name, bal: num(x.balance), rate: num(x.rate) / 100 / 12, min: num(x.min), cleared: null };
    }).filter(function (x) { return x.bal > 0; });
    if (!list.length) return { months: 0, interest: 0, perDebt: [] };

    var interest = 0, month = 0, LIMIT = 600;
    while (month < LIMIT && list.some(function (x) { return x.bal > 0.5; })) {
      month++;
      var pool = extra;
      // accrue interest, pay minimums
      list.forEach(function (x) {
        if (x.bal <= 0.5) { pool += x.min; return; }   // freed minimum rolls forward
        var i = x.bal * x.rate;
        interest += i;
        x.bal += i;
        var pay = Math.min(x.min, x.bal);
        x.bal -= pay;
        if (x.bal <= 0.5) { x.bal = 0; x.cleared = month; }
      });
      // everything spare at the first unpaid debt in priority order
      for (var n = 0; n < list.length && pool > 0; n++) {
        if (list[n].bal <= 0.5) continue;
        var p = Math.min(pool, list[n].bal);
        list[n].bal -= p;
        pool -= p;
        if (list[n].bal <= 0.5) { list[n].bal = 0; list[n].cleared = month; }
      }
    }
    return {
      months: month,
      interest: interest,
      perDebt: list.map(function (x) { return { name: x.name, cleared: x.cleared }; })
    };
  }

  /* ---------- 6. position score ---------- */
  function score(d, cf, totalDebt) {
    var cash = num(d.asset_cash);
    var monthsCovered = cf.out > 0 ? cash / cf.out : 0;

    var parts = [
      { key: "Cash reserve",     weight: 0.30, value: clamp(monthsCovered / 6 * 100, 0, 100),
        note: monthsCovered.toFixed(1) + " months of expenses on hand" },
      { key: "Debt load",        weight: 0.25, value: clamp(100 - (cf.dti / 0.36) * 100, 0, 100),
        note: pct(cf.dti) + " of take-home goes to debt minimums" },
      { key: "Savings rate",     weight: 0.25, value: clamp(cf.savingsRate / 0.20 * 100, 0, 100),
        note: pct(Math.max(0, cf.savingsRate)) + " of income is left over each month" }
    ];

    var credit = num(d.credit_score);
    if (credit >= 300 && credit <= 850) {
      parts.push({ key: "Credit health", weight: 0.10, value: clamp((credit - 300) / 550 * 100, 0, 100),
        note: "Reported score of " + credit });
    }

    var stabilityMap = {
      "Same every month — salaried": 95,
      "Mostly steady, small swings": 78,
      "Varies a lot month to month": 45,
      "Unpredictable / between things right now": 20
    };
    if (stabilityMap[d.income_stability] !== undefined) {
      parts.push({ key: "Income stability", weight: 0.10, value: stabilityMap[d.income_stability],
        note: d.income_stability });
    }

    var wsum = parts.reduce(function (s, p) { return s + p.weight; }, 0);
    var total = parts.reduce(function (s, p) { return s + p.value * p.weight; }, 0) / wsum;

    return {
      total: round(total),
      parts: parts.map(function (p) { return { key: p.key, value: round(p.value), note: p.note }; }),
      monthsCovered: monthsCovered
    };
  }

  /* ---------- 7. referrals — always out of our lane, never for a fee ---------- */
  function referrals(d) {
    var out = [];
    var kids = /child|kid|son|daughter|baby|\b[1-9]\b/i.test(d.household || "");
    if (kids && d.has_will !== "Yes") {
      out.push({
        to: "An estate attorney",
        why: "You have children and no will. This has nothing to do with money and it is the most important " +
             "item in this report. A simple will typically runs $300–600. Please don't wait for the debt to be gone."
      });
    }
    if ((d.debts || []).some(function (x) { return /student/i.test(x.name || ""); })) {
      out.push({
        to: "Your student loan servicer, or a student loan specialist",
        why: "You may qualify for an income-driven plan or a forgiveness track. That's a determination with real " +
             "legal consequences and we won't guess at it. Starting with your servicer is free."
      });
    }
    if (num(d.tax_refund) >= 1200) {
      out.push({
        to: "A CPA, before you next file",
        why: "Your refund suggests your withholding is off. A CPA should confirm the corrected number before you " +
             "change your W-4 — getting this wrong in the other direction means owing money in April."
      });
    }
    return out;
  }

  /* ---------- 8. the 90-day plan ---------- */
  function plan(leaks, match, cf, ordered, available) {
    var weeks = [], w = 1;
    var byKey = {};
    leaks.forEach(function (l) { byKey[l.key] = l; });

    if (byKey.subs) weeks.push({ week: w++, title: "Cancel what you're not using.",
      body: "Sit down once with your card statement and cancel every subscription you couldn't name. About 25 minutes.",
      why: "+" + money(byKey.subs.monthly) + "/month, permanent." });

    if (byKey.insurance) weeks.push({ week: w++, title: "Re-shop your insurance.",
      body: "Get three quotes, then ask your current carrier to match the best one before you switch.",
      why: "About " + money(byKey.insurance.monthly) + "/month, permanent. Around 30 minutes." });

    if (match) weeks.push({ week: w++, title: "Raise your retirement contribution to the full match.",
      body: "One form through your benefits portal. Do it the same week the money above frees up so the change nets out invisibly.",
      why: "+" + money(match.missedAnnual) + "/year. The highest-return move in this report." });

    if (byKey.food) weeks.push({ week: w++, title: "Pick one evening to plan the week's dinners.",
      body: "Decide the meals, shop once. This is the only habit change in the plan, and it targets the unplanned weeknights that drive takeout.",
      why: "+" + money(byKey.food.monthly) + "/month." });

    // Must be `available`, not free+recovered: the match contribution is
    // already spoken for, and an automation set $160 too high overdrafts them.
    weeks.push({ week: w++, title: "Automate the split the day after payday.",
      body: "Set an automatic transfer of " + money(Math.max(0, available)) + " out of checking the day after each paycheck lands, before you can see it." +
            (match ? " That figure is already net of the retirement contribution above." : ""),
      why: "This is the mechanism. Everything above was just finding the money." });

    if (ordered.length) weeks.push({ week: w++, title: "Freeze " + (ordered[0].name || "your highest-rate card") + ".",
      body: "Remove it from every saved payment field — phone wallet, browser autofill, retail accounts. Not cancelled (that hurts your utilization), just genuinely inconvenient.",
      why: "Stops the balance re-growing while you pay it down." });

    weeks.push({ week: w++, title: "Pull all three credit reports, free.",
      body: "annualcreditreport.com. You're looking for errors only — anything you don't recognize. Dispute in writing.",
      why: "Housekeeping, and it's free." });

    weeks.push({ week: w++, title: "Re-run your numbers.",
      body: "Check every figure in this report against reality. Then the sequence simply repeats: as each debt clears, its payment rolls onto the next one.",
      why: "The plan is self-sustaining from here." });

    return weeks;
  }

  /* ---------- main ---------- */
  function analyze(d) {
    d = d || {};
    d.debts = (d.debts || []).filter(function (x) { return num(x.balance) > 0; });

    var cf = cashFlow(d);
    var leaks = findLeaks(d, cf);
    var recovered = leaks.reduce(function (s, l) { return s + l.monthly; }, 0);
    var match = matchGap(d, cf);
    var refund = refundDrag(d);

    var ordered = orderDebts(d.debts);
    var totalDebt = d.debts.reduce(function (s, x) { return s + num(x.balance); }, 0);

    // What's actually available for debt, after funding the match.
    var available = Math.max(0, cf.free + recovered - (match ? match.costMonthly : 0));

    var optimal = simulate(ordered, available);
    var baseline = simulate(ordered, 0);
    var minimumsOnly = simulate(d.debts.slice(), 0);

    var sc = score(d, cf, totalDebt);

    // Where 90 days of this lands them. Recompute the derived ratios too —
    // a projection that only moves the cash line understates the change.
    var buffer = num(d.asset_cash) + available * 3;
    var projFree = cf.free + recovered - (match ? match.costMonthly : 0);
    var projOut = cf.out - recovered + (match ? match.costMonthly : 0);
    var projected = Object.assign({}, cf, {
      free: projFree,
      out: projOut,
      savingsRate: cf.income > 0 ? projFree / cf.income : 0,
      dti: cf.income > 0 ? cf.debtMin / cf.income : 0
    });
    var projScore = score(
      Object.assign({}, d, { asset_cash: buffer }),
      projected,
      totalDebt
    );

    return {
      generatedAt: new Date(),
      client: { name: d.name || "", email: d.email || "", state: d.state || "", household: d.household || "" },
      question: d.big_question || "",
      goals: d.goals || [],

      cashFlow: cf,
      leaks: leaks,
      recovered: recovered,
      match: match,
      refund: refund,

      debts: ordered,
      totalDebt: totalDebt,
      available: available,
      payoff: optimal,
      minimumsOnly: minimumsOnly,
      interestSaved: Math.max(0, minimumsOnly.interest - optimal.interest),
      monthsSaved: Math.max(0, minimumsOnly.months - optimal.months),

      score: sc,
      projectedScore: projScore,
      projectedBuffer: buffer,
      projectedFree: projected.free,

      plan: plan(leaks, match, cf, ordered, available),
      referrals: referrals(d),

      // Everything the engine deliberately does NOT decide. This list is the
      // honest case for the human tier — not a sales gimmick.
      limits: [
        "Whether the order above is right for your actual life, rather than just your spreadsheet.",
        "What your intake didn't ask, and what you didn't think to mention.",
        "Whether a major decision you're weighing — a house, a move, a business, a job change — holds up against these numbers.",
        "Anything that needs a judgment call about competing goals."
      ]
    };
  }

  root.OperatorEngine = { analyze: analyze, money: money, pct: pct, simulate: simulate, orderDebts: orderDebts };

})(typeof window !== "undefined" ? window : this);

if (typeof module !== "undefined" && module.exports) module.exports = (typeof window !== "undefined" ? window : this).OperatorEngine;
