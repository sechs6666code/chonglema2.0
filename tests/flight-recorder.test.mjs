import assert from "node:assert/strict";
import fs from "node:fs";
import { JSDOM } from "jsdom";

const source = fs.readFileSync(new URL("../assets/flight-recorder.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../assets/flight-recorder.css", import.meta.url), "utf8");

const dom = new JSDOM(`<!doctype html><html><body><div id="root"><main class="shell flight-shell">
  <header class="topbar"><div class="flight-wordmark"><strong>旧标题</strong></div><button class="leaderboard-trigger">排行榜</button><button class="more">更多</button></header>
  <section class="hero" id="top"><h1>今天，冲了吗？</h1></section>
  <button class="pwa-reminder-entry">每日提醒</button>
  <button class="leaderboard-inline-entry">双榜排行</button>
  <section class="stats"></section>
  <p class="month-summary">本月摘要</p>
  <section id="recovery-vault"></section>
  <section class="history"></section>
</main></div></body></html>`, {
  url: "https://example.test/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
});

const { window } = dom;
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
let scrolledTarget = null;
window.Element.prototype.scrollIntoView = function scrollIntoView() {
  scrolledTarget = this;
};

window.eval(source);
await new Promise((resolve) => window.setTimeout(resolve, 40));

assert.equal(window.document.documentElement.dataset.visualSystem, "quiet-ledger");
assert.ok(window.document.querySelector("main").classList.contains("quiet-shell"));
assert.equal(window.document.querySelector("main").classList.contains("flight-shell"), false);
assert.equal(window.document.querySelector(".ledger-wordmark strong").textContent, "冲了吗");
assert.match(window.document.querySelector(".ledger-wordmark span").textContent, /仅存本机/);
assert.equal(window.document.querySelectorAll(".quiet-dock button").length, 4);
assert.equal(window.document.querySelector(".quiet-dock button.is-active").dataset.route, "today");
assert.equal(window.document.querySelector(".quiet-dock svg"), null, "the quiet dock should rely on labels rather than decorative icons");
assert.equal(window.document.querySelector(".stats").dataset.ledgerZone, "trend");
assert.equal(window.document.querySelector("#recovery-vault").dataset.ledgerZone, "recovery");
assert.equal(window.document.querySelector(".history").getAttribute("aria-label"), "打卡记录");
assert.ok(window.document.querySelector(".pwa-reminder-entry").classList.contains("quiet-command-row"));

window.document.querySelector('[data-route="trend"]').click();
assert.equal(scrolledTarget, window.document.querySelector(".stats"));
assert.equal(window.document.querySelector(".quiet-dock button.is-active").dataset.route, "trend");

assert.match(css, /--surface-radius:\s*16px/);
assert.match(css, /--control-radius:\s*12px/);
assert.match(css, /min-height:\s*44px/);
assert.match(css, /\.month-switcher button\s*\{[^}]*min-height:\s*44px/s);
assert.match(css, /\.pwa-time-field\s*>\s*span\s*\{[^}]*white-space:\s*nowrap/s);
assert.match(css, /\.leaderboard-podium-horizon[\s\S]*display:\s*none\s*!important/);
assert.match(css, /\.leaderboard-profile-card\s*>\s*\.leaderboard-section-title\s+small/);
assert.match(source, /前 100 名/);
assert.match(css, /prefers-color-scheme: light/);
assert.match(css, /prefers-reduced-transparency: reduce/);
assert.match(css, /prefers-reduced-motion: reduce/);

dom.window.close();
console.log("quiet ledger interface tests passed");
