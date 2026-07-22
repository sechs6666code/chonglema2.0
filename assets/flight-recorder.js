(() => {
  const root = document.getElementById("root");
  if (!root) return;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)") || {
    matches: false,
    addEventListener() {},
  };
  const decorated = new WeakSet();
  const observedZones = new WeakSet();
  const zoneTargets = new Map();
  let dock = null;
  let dockButtons = [];
  let scanQueued = false;

  const icons = {
    today: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/></svg>',
    trend: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17 9 12l3 3 8-9"/><path d="M16 6h4v4"/></svg>',
    recovery: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/><path d="M9 15c.7 1.4 1.8 2 3.3 2"/></svg>',
    history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/><path d="M5 10h14M10 5v14"/></svg>',
  };

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
    if (dock || document.querySelector(".flight-dock")) return;
    dock = document.createElement("nav");
    dock.className = "flight-dock";
    dock.setAttribute("aria-label", "页面导航");
    dock.style.setProperty("--dock-index", "0");
    dock.innerHTML = `
      <i class="flight-dock-cursor" aria-hidden="true"></i>
      ${routes.map((route) => `
        <button type="button" data-route="${route.key}" aria-label="前往${route.label}">
          ${icons[route.key]}
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
    if (!topbar || topbar.querySelector(".flight-wordmark")) return;
    const wordmark = document.createElement("div");
    wordmark.className = "flight-wordmark";
    wordmark.innerHTML = `
      <strong>冲了吗</strong>
      <span><i aria-hidden="true"></i>记录仅存本机</span>
    `;
    topbar.prepend(wordmark);
  };

  const addZoneContract = (element, key) => {
    if (!element) return;
    element.dataset.flightZone = key;
    if (key !== "today" && !element.id) element.id = `flight-${key}`;
    zoneTargets.set(element, key);
    if (observedZones.has(element)) return;
    observedZones.add(element);
    zoneObserver?.observe(element);
  };

  const zoneObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setActiveRoute(zoneTargets.get(visible.target));
        },
        { rootMargin: "-18% 0px -54%", threshold: [0.08, 0.24, 0.48] },
      )
    : null;

  const decorateInteractiveRows = (element) => {
    if (!element || decorated.has(element)) return;
    decorated.add(element);
    element.classList.add("flight-command-row");
  };

  const scan = () => {
    const main = root.querySelector("main.shell");
    if (!main) return;
    document.documentElement.dataset.visualSystem = "flight-recorder";
    main.classList.add("flight-shell");
    createDock();
    createWordmark(main.querySelector(".topbar"));

    addZoneContract(main.querySelector("#top"), "today");
    addZoneContract(main.querySelector(".stats"), "trend");
    addZoneContract(main.querySelector("#recovery-vault"), "recovery");
    addZoneContract(main.querySelector(".history"), "history");

    decorateInteractiveRows(main.querySelector(".pwa-reminder-entry"));
    decorateInteractiveRows(main.querySelector(".leaderboard-inline-entry"));
    main.querySelector(".month-summary")?.setAttribute("role", "status");
    main.querySelector(".history")?.setAttribute("aria-label", "打卡记录带");
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
