(() => {
  const root = document.getElementById("root");
  if (!root) return;

  const html = document.documentElement;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)") || {
    matches: false,
    addEventListener() {},
  };
  const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)") || { matches: false };
  const palette = {
    mint: [66, 245, 179],
    coral: [255, 116, 108],
  };
  const fieldCanvas = document.createElement("canvas");
  const effectsCanvas = document.createElement("canvas");
  fieldCanvas.id = "signal-field";
  effectsCanvas.id = "signal-effects";
  fieldCanvas.setAttribute("aria-hidden", "true");
  effectsCanvas.setAttribute("aria-hidden", "true");
  document.body.prepend(effectsCanvas);
  document.body.prepend(fieldCanvas);
  html.classList.add("rb-motion-ready");
  html.dataset.motionSystem = "reactbits-patterns";

  let fieldContext = null;
  let effectsContext = null;
  try {
    fieldContext = fieldCanvas.getContext("2d", { alpha: true });
    effectsContext = effectsCanvas.getContext("2d", { alpha: true });
  } catch {
    // The product remains fully usable when canvas is unavailable.
  }

  let viewportWidth = 0;
  let viewportHeight = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let lastFrame = 0;
  let running = true;
  let scrollPosition = window.scrollY || 0;
  let previousScroll = scrollPosition;
  let scrollEnergy = 0;
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.24,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.24,
    energy: 0,
  };
  const bursts = [];
  const celebratedMilestones = new WeakSet();
  const revealed = new WeakSet();
  const spotlighted = new WeakSet();

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const rgba = (color, alpha) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;

  const resizeCanvas = (canvas, context) => {
    if (!context) return;
    canvas.width = Math.round(viewportWidth * pixelRatio);
    canvas.height = Math.round(viewportHeight * pixelRatio);
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const resize = () => {
    viewportWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    viewportHeight = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    resizeCanvas(fieldCanvas, fieldContext);
    resizeCanvas(effectsCanvas, effectsContext);
    if (reducedMotion.matches) drawFrame(performance.now(), true);
  };

  const drawField = (time) => {
    if (!fieldContext) return;
    fieldContext.clearRect(0, 0, viewportWidth, viewportHeight);
    const spacing = viewportWidth < 520 ? 28 : 34;
    const columns = Math.ceil(viewportWidth / spacing) + 2;
    const rows = Math.ceil(viewportHeight / spacing) + 2;
    const drift = reducedMotion.matches ? 0 : time * 0.00016;
    const scrollDrift = scrollPosition * 0.035;
    const interactionRadius = viewportWidth < 520 ? 138 : 190;

    pointer.x += (pointer.targetX - pointer.x) * 0.075;
    pointer.y += (pointer.targetY - pointer.y) * 0.075;
    pointer.energy *= 0.94;
    scrollEnergy *= 0.91;

    for (let row = -1; row < rows; row += 1) {
      for (let column = -1; column < columns; column += 1) {
        const baseX = column * spacing + (row % 2 ? spacing * 0.5 : 0);
        const baseY = row * spacing - (scrollDrift % spacing);
        const wave = reducedMotion.matches
          ? 0
          : Math.sin(drift * 7 + column * 0.48 + row * 0.31) * (1.2 + scrollEnergy * 2.4);
        const dx = baseX - pointer.x;
        const dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = clamp(1 - distance / interactionRadius, 0, 1);
        const push = influence * influence * (4 + pointer.energy * 8);
        const x = baseX + (distance ? (dx / distance) * push : 0);
        const y = baseY + wave + (distance ? (dy / distance) * push : 0);
        const edgeFade = clamp(1 - Math.abs(x - viewportWidth / 2) / (viewportWidth * 0.82), 0.14, 1);
        const alpha = (0.055 + influence * 0.22) * edgeFade;
        const radius = 0.65 + influence * 1.12;
        fieldContext.beginPath();
        fieldContext.arc(x, y, radius, 0, Math.PI * 2);
        fieldContext.fillStyle = rgba(palette.mint, alpha);
        fieldContext.fill();

        if (influence > 0.72 && !reducedMotion.matches) {
          fieldContext.beginPath();
          fieldContext.arc(x, y, radius + 2.6, 0, Math.PI * 2);
          fieldContext.fillStyle = rgba(palette.mint, influence * 0.035);
          fieldContext.fill();
        }
      }
    }
  };

  const drawEffects = (time) => {
    if (!effectsContext) return;
    effectsContext.clearRect(0, 0, viewportWidth, viewportHeight);
    for (let index = bursts.length - 1; index >= 0; index -= 1) {
      const burst = bursts[index];
      const progress = clamp((time - burst.startedAt) / burst.duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const fade = Math.pow(1 - progress, 1.5);
      const color = burst.color;

      effectsContext.save();
      effectsContext.translate(burst.x, burst.y);
      effectsContext.globalCompositeOperation = "lighter";

      const ringRadius = 9 + eased * burst.radius;
      effectsContext.beginPath();
      effectsContext.arc(0, 0, ringRadius, 0, Math.PI * 2);
      effectsContext.strokeStyle = rgba(color, fade * 0.62);
      effectsContext.lineWidth = Math.max(0.7, 2.2 * (1 - progress));
      effectsContext.stroke();

      const rayCount = burst.large ? 18 : 10;
      for (let ray = 0; ray < rayCount; ray += 1) {
        const angle = (Math.PI * 2 * ray) / rayCount + burst.rotation;
        const inner = 8 + eased * (burst.large ? 28 : 15);
        const outer = inner + fade * (burst.large ? 36 : 20);
        effectsContext.beginPath();
        effectsContext.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        effectsContext.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
        effectsContext.strokeStyle = rgba(color, fade * (burst.large ? 0.72 : 0.58));
        effectsContext.lineWidth = burst.large ? 1.4 : 1;
        effectsContext.stroke();
      }

      effectsContext.restore();
      if (progress >= 1) bursts.splice(index, 1);
    }
  };

  const drawFrame = (time, force = false) => {
    if (!running && !force) return;
    if (!force && time - lastFrame < 16) {
      animationFrame = requestAnimationFrame(drawFrame);
      return;
    }
    lastFrame = time;
    drawField(time);
    drawEffects(time);
    if (!reducedMotion.matches && running) animationFrame = requestAnimationFrame(drawFrame);
  };

  const burstAt = (x, y, tone = "mint", large = false) => {
    if (reducedMotion.matches || !effectsContext) return;
    bursts.push({
      x: Number.isFinite(x) ? x : viewportWidth / 2,
      y: Number.isFinite(y) ? y : viewportHeight / 2,
      color: palette[tone] || palette.mint,
      startedAt: performance.now(),
      duration: large ? 1080 : 620,
      radius: large ? Math.min(viewportWidth, viewportHeight) * 0.42 : 62,
      rotation: Math.random() * Math.PI,
      large,
    });
  };

  const elementCenter = (element) => {
    const rect = element?.getBoundingClientRect?.();
    if (!rect) return { x: viewportWidth / 2, y: viewportHeight / 2 };
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("rb-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -5%" },
      )
    : null;

  const installReveal = (element) => {
    if (!element || revealed.has(element)) return;
    revealed.add(element);
    element.classList.add("rb-reveal");
    const rect = element.getBoundingClientRect?.();
    if (
      reducedMotion.matches
      || !revealObserver
      || !rect
      || rect.top < viewportHeight * 0.9
    ) {
      element.classList.add("rb-visible");
    } else {
      revealObserver.observe(element);
    }
  };

  const updateSpotlight = (element, clientX, clientY) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--spot-x", `${clamp(clientX - rect.left, 0, rect.width)}px`);
    element.style.setProperty("--spot-y", `${clamp(clientY - rect.top, 0, rect.height)}px`);
  };

  const installSpotlight = (element) => {
    if (!element || spotlighted.has(element)) return;
    spotlighted.add(element);
    element.dataset.rbSpotlight = "true";
    element.addEventListener(
      "pointermove",
      (event) => updateSpotlight(element, event.clientX, event.clientY),
      { passive: true },
    );
    element.addEventListener(
      "pointerdown",
      (event) => updateSpotlight(element, event.clientX, event.clientY),
      { passive: true },
    );
    if (finePointer.matches) {
      element.addEventListener(
        "pointerleave",
        () => {
          element.style.removeProperty("--spot-x");
          element.style.removeProperty("--spot-y");
        },
        { passive: true },
      );
    }
  };

  const celebrateMilestone = (element) => {
    if (celebratedMilestones.has(element)) return;
    celebratedMilestones.add(element);
    const center = elementCenter(element);
    const tone = /冲/.test(element.textContent || "") ? "coral" : "mint";
    burstAt(center.x, center.y, tone, true);
    window.setTimeout(() => burstAt(center.x, center.y, tone, true), 210);
  };

  const replaySwap = (element) => {
    if (!element || reducedMotion.matches) return;
    element.classList.remove("rb-swap");
    void element.offsetWidth;
    element.classList.add("rb-swap");
    window.setTimeout(() => element.classList.remove("rb-swap"), 520);
  };

  const scan = () => {
    document
      .querySelectorAll(
        ".hero, .catchup, .pwa-reminder-entry, .recovery-module, .leaderboard-inline-entry, .stats, .month-summary, .history, .shell > footer",
      )
      .forEach(installReveal);
    document
      .querySelectorAll(
        ".answer, .pwa-reminder-entry, .recovery-module, .leaderboard-inline-entry, .streak-card, .history, .leaderboard-board-card, .pwa-schedule-card",
      )
      .forEach(installSpotlight);
    document.querySelectorAll(".milestone-pop").forEach(celebrateMilestone);
  };

  let scanQueued = false;
  const queueScan = () => {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(() => {
      scanQueued = false;
      scan();
    });
  };

  const mutationObserver = new MutationObserver((records) => {
    queueScan();
    records.forEach((record) => {
      if (record.type === "characterData") {
        const list = record.target.parentElement?.closest(".leaderboard-list, .leaderboard-board-summary");
        if (list) replaySwap(list);
      }
      record.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(".calendar-month, .leaderboard-list")) replaySwap(node);
        node.querySelectorAll?.(".calendar-month, .leaderboard-list").forEach(replaySwap);
      });
    });
  });

  mutationObserver.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  document.addEventListener(
    "pointermove",
    (event) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.energy = Math.min(1, pointer.energy + 0.12);
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerdown",
    (event) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.energy = 1;
      const answer = event.target.closest?.(".answer");
      const interactive = event.target.closest?.("button, [role='button'], summary");
      if (!interactive) return;
      burstAt(event.clientX, event.clientY, answer?.classList.contains("yes") ? "coral" : "mint");
      if (answer) {
        const hero = answer.closest(".hero");
        hero?.classList.remove("rb-checkin-impact");
        void hero?.offsetWidth;
        hero?.classList.add("rb-checkin-impact");
        window.setTimeout(() => hero?.classList.remove("rb-checkin-impact"), 760);
      }
    },
    { passive: true, capture: true },
  );

  document.addEventListener(
    "click",
    (event) => {
      const tab = event.target.closest?.(".leaderboard-tabs [data-tab]");
      if (tab) window.setTimeout(() => replaySwap(document.querySelector(".leaderboard-list")), 0);
      const month = event.target.closest?.(".month-switcher button, .month-grid > button");
      if (month) window.setTimeout(() => replaySwap(document.querySelector(".calendar-month")), 0);
    },
    { capture: true },
  );

  window.addEventListener(
    "scroll",
    () => {
      scrollPosition = window.scrollY || 0;
      const velocity = Math.abs(scrollPosition - previousScroll);
      previousScroll = scrollPosition;
      scrollEnergy = clamp(scrollEnergy + velocity / 80, 0, 1);
    },
    { passive: true },
  );

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !reducedMotion.matches) {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(drawFrame);
    }
  });

  reducedMotion.addEventListener?.("change", () => {
    cancelAnimationFrame(animationFrame);
    if (reducedMotion.matches) {
      bursts.length = 0;
      document.querySelectorAll(".rb-reveal").forEach((element) => element.classList.add("rb-visible"));
      drawFrame(performance.now(), true);
    } else {
      animationFrame = requestAnimationFrame(drawFrame);
    }
  });

  resize();
  scan();
  if (reducedMotion.matches) drawFrame(performance.now(), true);
  else animationFrame = requestAnimationFrame(drawFrame);
})();
