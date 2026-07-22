(() => {
  const root = document.getElementById("root");
  if (!root) return;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)") || {
    matches: false,
    addEventListener() {},
  };
  const decorated = new WeakSet();
  const observedSections = new WeakSet();
  const sectionRoutes = new Map();
  let dock = null;
  let dockButtons = [];
  let scanQueued = false;

  const routes = [
    { key: "today", label: "今天", selector: "#top" },
    { key: "trend", label: "趋势", selector: ".stats" },
    { key: "recovery", label: "恢复", selector: "#recovery-vault" },
    { key: "history", label: "记录", selector: ".history" },
  ];

  const setActiveRoute = (key) => {
    const index = routes.findIndex((route) => route.key === key);
    if (!dock || index < 0) return;
    dock.style.setProperty("--dock-index", String(index));
    dockButtons.forEach((button) => {
      const active = button.dataset.route === key;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  };

  const createDock = () => {
    if (dock || document.querySelector(".quiet-dock")) return;
    dock = document.createElement("nav");
    dock.className = "quiet-dock";
    dock.setAttribute("aria-label", "页面导航");
    dock.style.setProperty("--dock-index", "0");
    dock.innerHTML = `
      <i class="quiet-dock-cursor" aria-hidden="true"></i>
      ${routes.map((route) => `
        <button type="button" data-route="${route.key}" aria-label="前往${route.label}">
          <span>${route.label}</span>
        </button>
      `).join("")}
    `;
    document.body.append(dock);
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
    setActiveRoute("today");
  };

  const createWordmark = (topbar) => {
    if (!topbar || topbar.querySelector(".ledger-wordmark")) return;
    topbar.querySelector(".flight-wordmark")?.remove();
    const wordmark = document.createElement("div");
    wordmark.className = "ledger-wordmark";
    wordmark.innerHTML = `
      <strong>冲了吗</strong>
      <span>私密记录 · 仅存本机</span>
    `;
    topbar.prepend(wordmark);
  };

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("quiet-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8%", threshold: 0.08 },
      )
    : null;

  const installReveal = (element) => {
    if (!element || decorated.has(element)) return;
    decorated.add(element);
    element.classList.add("quiet-reveal");
    const rect = element.getBoundingClientRect?.();
    if (reducedMotion.matches || !revealObserver || !rect || rect.top < window.innerHeight * 0.9) {
      element.classList.add("quiet-visible");
    } else {
      revealObserver.observe(element);
    }
  };

  const setSectionContract = (element, key) => {
    if (!element) return;
    element.dataset.ledgerZone = key;
    sectionRoutes.set(element, key);
    if (observedSections.has(element)) return;
    observedSections.add(element);
    routeObserver?.observe(element);
  };

  const routeObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setActiveRoute(sectionRoutes.get(visible.target));
        },
        { rootMargin: "-20% 0px -55%", threshold: [0.08, 0.28, 0.5] },
      )
    : null;

  const scan = () => {
    const main = root.querySelector("main.shell");
    if (!main) return;
    document.documentElement.dataset.visualSystem = "quiet-ledger";
    main.classList.remove("flight-shell");
    main.classList.add("quiet-shell");

    createDock();
    createWordmark(main.querySelector(".topbar"));

    const sections = [
      [main.querySelector("#top"), "today"],
      [main.querySelector(".stats"), "trend"],
      [main.querySelector("#recovery-vault"), "recovery"],
      [main.querySelector(".history"), "history"],
    ];
    sections.forEach(([element, key]) => {
      setSectionContract(element, key);
      installReveal(element);
    });

    [
      main.querySelector(".catchup"),
      main.querySelector(".pwa-reminder-entry"),
      main.querySelector(".leaderboard-inline-entry"),
      main.querySelector(".month-summary"),
      main.querySelector("footer"),
    ].forEach(installReveal);

    main.querySelector(".pwa-reminder-entry")?.classList.add("quiet-command-row");
    main.querySelector(".leaderboard-inline-entry")?.classList.add("quiet-command-row");
    main.querySelector(".month-summary")?.setAttribute("role", "status");
    main.querySelector(".history")?.setAttribute("aria-label", "打卡记录");
    main.querySelector(".stats")?.setAttribute("aria-label", "趋势总览");
  };

  const queueScan = () => {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(() => {
      scanQueued = false;
      scan();
    });
  };

  const observer = new MutationObserver(queueScan);
  observer.observe(root, { childList: true, subtree: true });
  reducedMotion.addEventListener?.("change", queueScan);
  scan();
})();
