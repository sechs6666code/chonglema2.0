(() => {
  const root = document.getElementById("root");
  if (!root) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)") || {
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  };

  const ICONS = {
    today: "icon-house",
    trend: "icon-chart",
    recovery: "icon-droplets",
    history: "icon-calendar",
  };

  const routes = [
    { key: "today", label: "今天", selector: "#top" },
    { key: "trend", label: "趋势", selector: ".stats" },
    { key: "recovery", label: "恢复", selector: "#recovery-vault" },
    { key: "history", label: "记录", selector: ".history" },
  ];

  const sectionRoutes = new Map();
  const observedSections = new WeakSet();
  const revealSections = new WeakSet();
  const animatedSheets = new WeakSet();
  const boundAnswers = new WeakSet();
  const boundMagnetic = new WeakSet();
  let dock = null;
  let dockCursor = null;
  let dockButtons = [];
  let routeObserver = null;
  let domObserver = null;
  let mediaContext = null;
  let scanQueued = false;
  let introPlayed = false;

  const icon = (name, extra = "") =>
    `<i class="app-icon ${name} ${extra}" aria-hidden="true"></i>`;

  const setActiveRoute = (key, animate = true) => {
    const index = routes.findIndex((route) => route.key === key);
    if (!dock || index < 0) return;
    dock.dataset.activeRoute = key;
    dock.style.setProperty("--dock-index", String(index));
    dockButtons.forEach((button) => {
      const active = button.dataset.route === key;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    if (dockCursor && gsap && animate && !reducedMotion.matches) {
      gsap.to(dockCursor, {
        xPercent: index * 100,
        duration: 0.48,
        ease: "power3.out",
        overwrite: "auto",
      });
    } else if (dockCursor) {
      dockCursor.style.transform = `translateX(${index * 100}%)`;
    }
  };

  const createDock = () => {
    if (dock || document.querySelector(".continuum-dock")) {
      dock = document.querySelector(".continuum-dock");
      dockCursor = dock?.querySelector(".continuum-dock-cursor") || null;
      dockButtons = dock ? [...dock.querySelectorAll("button[data-route]")] : [];
      return;
    }

    dock = document.createElement("nav");
    dock.className = "continuum-dock liquid-glass-web-approx";
    dock.setAttribute("aria-label", "页面导航");
    dock.style.setProperty("--dock-index", "0");
    dock.innerHTML = `
      <i class="continuum-dock-cursor" aria-hidden="true"></i>
      ${routes.map((route) => `
        <button type="button" data-route="${route.key}" aria-label="前往${route.label}">
          ${icon(ICONS[route.key])}
          <span>${route.label}</span>
        </button>
      `).join("")}
    `;
    document.body.append(dock);
    dockCursor = dock.querySelector(".continuum-dock-cursor");
    dockButtons = [...dock.querySelectorAll("button[data-route]")];

    dockButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const route = routes.find((item) => item.key === button.dataset.route);
        const target = route ? document.querySelector(route.selector) : null;
        if (!target) return;
        target.scrollIntoView({
          behavior: reducedMotion.matches ? "auto" : "smooth",
          block: route.key === "today" ? "start" : "center",
        });
        setActiveRoute(route.key);
      });
    });

    setActiveRoute("today", false);
  };

  const createAmbientField = () => {
    if (document.querySelector(".continuum-ambient")) return;
    const ambient = document.createElement("div");
    ambient.className = "continuum-ambient";
    ambient.setAttribute("aria-hidden", "true");
    ambient.innerHTML = '<i class="continuum-light continuum-light-one"></i><i class="continuum-light continuum-light-two"></i>';
    document.body.prepend(ambient);
  };

  const createWordmark = (topbar) => {
    if (!topbar) return;
    topbar.querySelector(".ledger-wordmark, .flight-wordmark")?.remove();
    if (topbar.querySelector(".continuum-wordmark")) return;

    const wordmark = document.createElement("div");
    wordmark.className = "continuum-wordmark";
    wordmark.innerHTML = `
      <span class="continuum-mark">${icon("icon-shield")}</span>
      <span class="continuum-wordmark-copy">
        <strong>冲了吗</strong>
        <small>仅存本机</small>
      </span>
    `;
    topbar.prepend(wordmark);
  };

  const decorateTopbar = (topbar) => {
    if (!topbar) return;
    createWordmark(topbar);
    const leaderboard = topbar.querySelector(".leaderboard-trigger");
    const more = topbar.querySelector(".more");
    leaderboard?.classList.add("continuum-icon-button", "continuum-leaderboard-button");
    more?.classList.add("continuum-icon-button");
    if (leaderboard && !leaderboard.querySelector(".continuum-button-icon")) {
      leaderboard.insertAdjacentHTML("afterbegin", icon("icon-trophy", "continuum-button-icon"));
    }
    if (more) {
      more.setAttribute("aria-label", "更多选项");
      if (!more.querySelector(".continuum-button-icon")) {
        more.insertAdjacentHTML("afterbegin", icon("icon-ellipsis", "continuum-button-icon"));
      }
    }
  };

  const createPrivacyPromise = (hero) => {
    if (!hero || hero.querySelector(".privacy-promise")) return;
    const promise = document.createElement("div");
    promise.className = "privacy-promise";
    promise.innerHTML = `${icon("icon-lock")}<span>完整记录只保存在这台设备</span>`;
    const saved = hero.querySelector(".saved");
    if (saved) hero.insertBefore(promise, saved);
    else hero.append(promise);
  };

  const readChoice = (actions) => {
    if (actions.querySelector(".answer.no.selected")) return "no";
    if (actions.querySelector(".answer.yes.selected")) return "yes";
    return "none";
  };

  const positionChoiceIndicator = (actions, animate = true) => {
    const indicator = actions.querySelector(".choice-indicator");
    if (!indicator) return;
    const choice = readChoice(actions);
    actions.dataset.choice = choice;
    const target = choice === "yes" ? 100 : 0;
    const hidden = choice === "none";

    if (gsap && animate && !reducedMotion.matches) {
      gsap.to(indicator, {
        xPercent: target,
        autoAlpha: hidden ? 0 : 1,
        scale: hidden ? 0.94 : 1,
        duration: 0.52,
        ease: "power3.out",
        overwrite: "auto",
      });
    } else {
      indicator.style.transform = `translateX(${target}%) scale(${hidden ? 0.94 : 1})`;
      indicator.style.opacity = hidden ? "0" : "1";
      indicator.style.visibility = hidden ? "hidden" : "inherit";
    }
  };

  const playChoiceFeedback = (answer) => {
    const actions = answer.closest(".check-actions");
    if (!actions) return;
    const choice = answer.classList.contains("yes") ? "yes" : "no";
    actions.dataset.intent = choice;

    if (!gsap || reducedMotion.matches) return;
    const copy = answer.querySelectorAll("b, small");
    const iconElement = answer.querySelector(".answer-icon");
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => delete actions.dataset.intent,
    });
    timeline
      .to(answer, { scale: 0.985, duration: 0.1 })
      .to(answer, { scale: 1, duration: 0.42 }, ">")
      .fromTo(iconElement, { scale: 0.82, rotation: choice === "yes" ? -6 : 6 }, {
        scale: 1,
        rotation: 0,
        duration: 0.44,
      }, "<0.02")
      .fromTo(copy, { y: 4, autoAlpha: 0.68 }, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.04,
        duration: 0.34,
      }, "<0.06");
  };

  const decorateChoices = (hero) => {
    const actions = hero?.querySelector(".check-actions");
    if (!actions) return;
    actions.classList.add("liquid-choice");
    if (!actions.querySelector(".choice-indicator")) {
      actions.insertAdjacentHTML("afterbegin", '<i class="choice-indicator" aria-hidden="true"></i>');
    }

    const choices = [...actions.querySelectorAll(".answer")];
    choices.forEach((answer) => {
      const isYes = answer.classList.contains("yes");
      answer.dataset.choice = isYes ? "yes" : "no";
      const answerIcon = answer.querySelector(".answer-icon");
      answerIcon?.classList.add("app-icon", isYes ? "icon-x" : "icon-check");
      if (boundAnswers.has(answer)) return;
      boundAnswers.add(answer);
      answer.addEventListener("click", () => {
        playChoiceFeedback(answer);
        requestAnimationFrame(() => positionChoiceIndicator(actions));
      });
    });

    positionChoiceIndicator(actions, false);
  };

  const createStatsHeading = (stats) => {
    if (!stats || stats.querySelector(".continuum-section-heading")) return;
    const heading = document.createElement("header");
    heading.className = "continuum-section-heading";
    heading.innerHTML = `
      <div>
        <h2>你的节奏</h2>
        <p>记录会慢慢显出规律。</p>
      </div>
      ${icon("icon-chart")}
    `;
    stats.prepend(heading);
  };

  const decorateCommandRows = (main) => {
    const reminder = main.querySelector(".pwa-reminder-entry");
    const leaderboard = main.querySelector(".leaderboard-inline-entry");
    reminder?.classList.add("continuum-command-row", "continuum-reminder-row");
    leaderboard?.classList.add("continuum-command-row", "continuum-ranking-row");
    if (reminder && !reminder.querySelector(".continuum-command-icon")) {
      reminder.insertAdjacentHTML("afterbegin", `<span class="continuum-command-icon">${icon("icon-bell")}</span>`);
    }
    if (leaderboard && !leaderboard.querySelector(".continuum-command-icon")) {
      leaderboard.insertAdjacentHTML("afterbegin", `<span class="continuum-command-icon">${icon("icon-trophy")}</span>`);
    }
  };

  const decorateSections = (main) => {
    const stats = main.querySelector(".stats");
    const recovery = main.querySelector("#recovery-vault");
    const history = main.querySelector(".history");

    createStatsHeading(stats);
    stats?.classList.add("continuum-panel", "continuum-stats");
    recovery?.classList.add("continuum-panel");
    history?.classList.add("continuum-panel");
    history?.setAttribute("aria-label", "打卡记录");
    stats?.setAttribute("aria-label", "趋势总览");
    main.querySelector(".month-summary")?.setAttribute("role", "status");

    [
      [main.querySelector("#top"), "today"],
      [stats, "trend"],
      [recovery, "recovery"],
      [history, "history"],
    ].forEach(([element, key]) => {
      if (!element) return;
      element.dataset.continuumZone = key;
      sectionRoutes.set(element, key);
      if (routeObserver && !observedSections.has(element)) {
        observedSections.add(element);
        routeObserver.observe(element);
      }
    });
  };

  const animateIntro = (main) => {
    if (introPlayed || !gsap || reducedMotion.matches) return;
    introPlayed = true;
    const timeline = gsap.timeline({
      defaults: { ease: "power4.out" },
    });
    timeline
      .fromTo(".continuum-wordmark", {
        y: -10,
        autoAlpha: 0,
        filter: "blur(8px)",
      }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.72,
      })
      .fromTo(".topbar .continuum-icon-button", {
        y: -8,
        autoAlpha: 0,
      }, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.06,
        duration: 0.5,
      }, "<0.12")
      .fromTo([
        main.querySelector(".hero .date"),
        main.querySelector(".hero h1"),
        main.querySelector(".hero .subline"),
      ], {
        y: 20,
        autoAlpha: 0,
        filter: "blur(10px)",
      }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        stagger: 0.07,
        duration: 0.82,
      }, "<0.04")
      .fromTo(main.querySelector(".check-actions"), {
        y: 26,
        autoAlpha: 0,
        scale: 0.985,
        clipPath: "inset(0 0 18% 0 round 22px)",
      }, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        clipPath: "inset(0 0 0% 0 round 22px)",
        duration: 0.86,
      }, "<0.18")
      .fromTo(main.querySelector(".privacy-promise"), {
        y: 8,
        autoAlpha: 0,
      }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.52,
      }, "<0.24");
  };

  const animateSection = (section) => {
    if (!gsap || reducedMotion.matches || revealSections.has(section)) return;
    revealSections.add(section);
    gsap.fromTo(section, {
      y: 18,
      autoAlpha: 0.01,
      filter: "blur(8px)",
    }, {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 0.88,
      ease: "power4.out",
      clearProps: "transform,filter,opacity,visibility",
    });
  };

  const setupMotion = (main) => {
    if (!gsap || mediaContext) return;
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    mediaContext = gsap.matchMedia();
    mediaContext.add({
      reduceMotion: "(prefers-reduced-motion: reduce)",
      desktop: "(hover: hover) and (pointer: fine)",
    }, (context) => {
      const { reduceMotion, desktop } = context.conditions;
      if (reduceMotion) return undefined;

      animateIntro(main);

      if (ScrollTrigger) {
        ScrollTrigger.batch([
          ".continuum-command-row",
          ".continuum-stats",
          "#recovery-vault",
          ".history",
        ], {
          start: "top 88%",
          once: true,
          onEnter: (elements) => elements.forEach(animateSection),
        });

        gsap.to(document.documentElement, {
          "--depth-shift": 1,
          ease: "none",
          scrollTrigger: {
            trigger: main,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }

      const cleanups = [];
      if (desktop) {
        document.querySelectorAll(".continuum-icon-button, .continuum-dock button").forEach((button) => {
          if (boundMagnetic.has(button)) return;
          boundMagnetic.add(button);
          const xTo = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3.out" });
          const yTo = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3.out" });
          const move = (event) => {
            const rect = button.getBoundingClientRect();
            xTo((event.clientX - rect.left - rect.width / 2) * 0.12);
            yTo((event.clientY - rect.top - rect.height / 2) * 0.12);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          button.addEventListener("pointermove", move);
          button.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            button.removeEventListener("pointermove", move);
            button.removeEventListener("pointerleave", leave);
          });
        });
      }
      return () => cleanups.forEach((cleanup) => cleanup());
    });
  };

  const animateSheets = () => {
    if (!gsap || reducedMotion.matches) return;
    const selectors = [
      ".leaderboard-overlay.is-open .leaderboard-panel",
      ".pwa-reminder-overlay.is-open .pwa-reminder-panel",
      ".history-sheet .history-panel",
      ".recovery-editor.is-open .recovery-editor-panel",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((panel) => {
        if (animatedSheets.has(panel)) return;
        animatedSheets.add(panel);
        gsap.fromTo(panel, {
          y: 34,
          autoAlpha: 0.72,
          filter: "blur(10px)",
          scale: 0.985,
        }, {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.62,
          ease: "power4.out",
          clearProps: "transform,filter,opacity,visibility",
        });
      });
    });
  };

  const normalizeSecondaryCopy = () => {
    const rankingFooter = document.querySelector(".leaderboard-board-card > footer");
    if (rankingFooter?.textContent?.includes("TOP 100")) {
      rankingFooter.textContent = "前 100 名。数据来自用户主动公开的历史最佳记录。";
    }
    document.querySelectorAll(".leaderboard-section-title small").forEach((label) => {
      if (/MY PROFILE|TOP 100/i.test(label.textContent || "")) label.remove();
    });
  };

  const scan = () => {
    const main = root.querySelector("main.shell");
    if (!main) return;

    document.documentElement.dataset.visualSystem = "quiet-continuum";
    main.classList.remove("flight-shell", "quiet-shell");
    main.classList.add("continuum-shell");

    createAmbientField();
    createDock();
    decorateTopbar(main.querySelector(".topbar"));
    createPrivacyPromise(main.querySelector(".hero"));
    decorateChoices(main.querySelector(".hero"));
    decorateCommandRows(main);
    decorateSections(main);
    normalizeSecondaryCopy();
    setupMotion(main);
    animateSheets();
  };

  routeObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveRoute(sectionRoutes.get(visible.target));
      }, {
        rootMargin: "-22% 0px -58%",
        threshold: [0.08, 0.28, 0.5],
      })
    : null;

  const queueScan = () => {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(() => {
      scanQueued = false;
      scan();
    });
  };

  domObserver = new MutationObserver(queueScan);
  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "aria-hidden"],
  });
  reducedMotion.addEventListener?.("change", queueScan);
  window.addEventListener("pagehide", () => {
    domObserver?.disconnect();
    routeObserver?.disconnect();
    mediaContext?.revert();
    ScrollTrigger?.getAll().forEach((trigger) => trigger.kill());
    reducedMotion.removeEventListener?.("change", queueScan);
  }, { once: true });

  scan();
})();
