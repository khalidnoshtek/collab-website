/* =============================================================================
   Collab — collabcubicles.com
   Nav (desktop mega-menu + mobile drawer), service chooser, scroll reveals.
   No dependencies.
   ============================================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------------
     Solutions mega-menu — hover on pointer devices, click/keyboard everywhere
     --------------------------------------------------------------------------- */

  var menu = document.querySelector("[data-menu]");
  if (menu) {
    var trigger = menu.querySelector("[data-menu-trigger]");
    var panel = menu.querySelector("[data-menu-panel]");
    var hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var closeTimer;

    function setMenu(open) {
      menu.setAttribute("data-open", open ? "true" : "false");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    setMenu(false);

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      setMenu(menu.getAttribute("data-open") !== "true");
    });

    if (hoverCapable) {
      menu.addEventListener("mouseenter", function () {
        clearTimeout(closeTimer);
        setMenu(true);
      });
      menu.addEventListener("mouseleave", function () {
        closeTimer = setTimeout(function () { setMenu(false); }, 120);
      });
    }

    // Close when focus leaves the menu entirely.
    menu.addEventListener("focusout", function (e) {
      if (!menu.contains(e.relatedTarget)) setMenu(false);
    });

    // Close on outside click.
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) setMenu(false);
    });

    // Close on Escape, returning focus to the trigger.
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.getAttribute("data-open") === "true") {
        setMenu(false);
        trigger.focus();
      }
    });

    // Navigating to a section should dismiss the menu.
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
  }

  /* ---------------------------------------------------------------------------
     Mobile drawer
     --------------------------------------------------------------------------- */

  var drawerTrigger = document.querySelector("[data-drawer-trigger]");
  var drawer = document.querySelector("[data-drawer]");

  if (drawerTrigger && drawer) {
    function setDrawer(open) {
      drawer.setAttribute("data-open", open ? "true" : "false");
      drawerTrigger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("is-locked", open);
      if (open) {
        drawer.hidden = false;
      } else {
        // Keep it out of the a11y tree once the transition has finished.
        window.setTimeout(function () {
          if (drawer.getAttribute("data-open") !== "true") drawer.hidden = true;
        }, reduceMotion ? 0 : 240);
      }
    }

    setDrawer(false);

    drawerTrigger.addEventListener("click", function () {
      setDrawer(drawer.getAttribute("data-open") !== "true");
    });

    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setDrawer(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.getAttribute("data-open") === "true") {
        setDrawer(false);
        drawerTrigger.focus();
      }
    });

    // Leaving the mobile breakpoint should never strand the page in a locked state.
    window.matchMedia("(min-width: 1001px)").addEventListener("change", function (ev) {
      if (ev.matches) setDrawer(false);
    });
  }

  /* ---------------------------------------------------------------------------
     "What are you looking to do?" — problem-first service chooser
     --------------------------------------------------------------------------- */

  var PLANS = {
    start: {
      title: "Starting a company?",
      note: "Get incorporated, get an address, get a desk — handled as one setup rather than three vendors.",
      items: ["Company Registration", "Registered / Virtual Address", "Hot Desk or Private Cabin", "Accounting & Compliance Setup"]
    },
    team: {
      title: "Already running a business?",
      note: "Space for the team plus the back office that keeps it compliant month after month.",
      items: ["Managed Office", "Payroll Processing", "Accounting & Bookkeeping", "Administrative Support"]
    },
    grow: {
      title: "Need more customers?",
      note: "Strategy, channels and reporting — with the website and tracking built in the same place.",
      items: ["SEO", "Digital Marketing", "Social Media", "Lead Generation"]
    },
    build: {
      title: "Need custom technology?",
      note: "Websites, internal tools and automation built around how your business actually works.",
      items: ["Website Development", "Custom Software", "Integrations", "AI Automation"]
    }
  };

  var choices = Array.prototype.slice.call(document.querySelectorAll("[data-plan]"));
  var panelEl = document.getElementById("plan-panel");

  if (choices.length && panelEl) {
    var titleEl = panelEl.querySelector("[data-plan-title]");
    var noteEl = panelEl.querySelector("[data-plan-note]");
    var itemsEl = panelEl.querySelector("[data-plan-items]");
    var clearEl = panelEl.querySelector("[data-plan-clear]");
    var selected = null;

    function render() {
      choices.forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.dataset.plan === selected ? "true" : "false");
      });

      if (!selected) {
        panelEl.hidden = true;
        itemsEl.textContent = "";
        return;
      }

      var plan = PLANS[selected];
      titleEl.textContent = plan.title;
      noteEl.textContent = plan.note;
      itemsEl.textContent = "";
      plan.items.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        itemsEl.appendChild(li);
      });
      panelEl.hidden = false;
    }

    choices.forEach(function (btn) {
      btn.addEventListener("click", function () {
        selected = selected === btn.dataset.plan ? null : btn.dataset.plan;
        render();
      });
    });

    if (clearEl) {
      clearEl.addEventListener("click", function () {
        selected = null;
        render();
        choices[0].focus();
      });
    }

    render();
  }

  /* ---------------------------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------------------------- */

  var revealTargets = document.querySelectorAll(".reveal, .reveal-group");

  // Index staggered children so CSS can offset their transition-delay.
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--i", Math.min(i, 8));
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------------- */

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
