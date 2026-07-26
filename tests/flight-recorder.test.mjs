import assert from "node:assert/strict";
import fs from "node:fs";
import { JSDOM } from "jsdom";

const source = fs.readFileSync(new URL("../assets/flight-recorder.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../assets/flight-recorder.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

const dom = new JSDOM(`<!doctype html><html><body><div id="root"><main class="shell quiet-shell">
  <header class="topbar">
    <div class="ledger-wordmark"><strong>旧标题</strong></div>
    <button class="leaderboard-trigger"><span>排行榜</span><b>0</b></button>
    <button class="more">更多</button>
  </header>
  <section class="hero" id="top">
    <p class="date">7月26日星期日</p>
    <h1>今天，冲了吗？</h1>
    <p class="subline">如实记录就好。</p>
    <div class="check-actions">
      <button class="answer no"><span class="answer-icon"><svg></svg></span><span><b>没冲</b><small>今天稳住了</small></span></button>
      <button class="answer yes selected"><span class="answer-icon"><svg></svg></span><span><b>冲了</b><small>记录，然后继续</small></span></button>
    </div>
    <div class="saved">今天已经记下</div>
  </section>
  <button class="catchup"><span>昨天还没有记录</span><b>去补一下</b></button>
  <button class="pwa-reminder-entry">
    <i class="pwa-reminder-status-dot"></i>
    <span class="pwa-reminder-copy"><small>每日提醒</small><strong>固定时间，轻轻提醒</strong><em>点击设置提醒</em></span>
    <span class="pwa-reminder-time">未开启</span>
  </button>
  <button class="leaderboard-inline-entry">
    <span class="leaderboard-inline-icon"></span>
    <span class="leaderboard-inline-copy"><small>双榜排行</small><strong>看看大家的最佳纪录</strong><em>公开由您决定</em></span>
    <span class="leaderboard-inline-scores"><span><b>0</b><small>忍住最长</small></span></span>
  </button>
  <section class="stats"><article class="stat-card streak-card"></article><article class="stat-card"></article><article class="stat-card"></article></section>
  <p class="month-summary">本月摘要</p>
  <section id="recovery-vault" class="recovery-module"></section>
  <section class="history"><div class="month-switcher"><button>上个月</button><button class="month-current">7月</button><button>下个月</button></div></section>
</main></div></body></html>`, {
  url: "https://example.test/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
});

const { window } = dom;
window.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});
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
await new Promise((resolve) => window.setTimeout(resolve, 50));

assert.equal(window.document.documentElement.dataset.visualSystem, "quiet-continuum");
assert.ok(window.document.querySelector("main").classList.contains("continuum-shell"));
assert.equal(window.document.querySelector("main").classList.contains("quiet-shell"), false);
assert.equal(window.document.querySelector(".continuum-wordmark strong").textContent, "冲了吗");
assert.match(window.document.querySelector(".continuum-wordmark small").textContent, /仅存本机/);
assert.ok(window.document.querySelector(".continuum-wordmark .icon-shield"));
assert.ok(window.document.querySelector(".privacy-promise .icon-lock"));
assert.ok(window.document.querySelector(".check-actions .choice-indicator"));
assert.equal(window.document.querySelector(".check-actions").dataset.choice, "yes");
assert.ok(window.document.querySelector(".answer.no .icon-check"));
assert.ok(window.document.querySelector(".answer.yes .icon-x"));
assert.equal(window.document.querySelectorAll(".continuum-dock button").length, 4);
assert.equal(window.document.querySelector(".continuum-dock button.is-active").dataset.route, "today");
assert.equal(window.document.querySelector(".continuum-dock svg"), null);
assert.equal(window.document.querySelectorAll(".continuum-dock .app-icon").length, 4);
assert.equal(window.document.querySelector(".stats").dataset.continuumZone, "trend");
assert.equal(window.document.querySelector("#recovery-vault").dataset.continuumZone, "recovery");
assert.equal(window.document.querySelector(".history").getAttribute("aria-label"), "打卡记录");
assert.equal(window.document.querySelector(".continuum-section-heading h2").textContent, "你的节奏");
assert.ok(window.document.querySelector(".pwa-reminder-entry .continuum-command-icon .icon-bell"));
assert.ok(window.document.querySelector(".leaderboard-inline-entry .continuum-command-icon .icon-trophy"));

window.document.querySelector('[data-route="trend"]').click();
assert.equal(scrolledTarget, window.document.querySelector(".stats"));
assert.equal(window.document.querySelector(".continuum-dock button.is-active").dataset.route, "trend");

assert.match(css, /@font-face[\s\S]*inter-variable\.woff2/);
assert.match(css, /--radius-surface:\s*22px/);
assert.match(css, /--accent-deep:\s*#0a84ff/);
assert.match(css, /\.icon-house\s*\{\s*--icon:\s*url\("\.\/icons\/house\.svg"\)/);
assert.match(css, /\.continuum-shell \.month-switcher button\s*\{[^}]*min-height:\s*44px/s);
assert.match(css, /\.continuum-shell \.calendar-day\s*\{[^}]*min-height:\s*44px/s);
assert.match(css, /\.continuum-shell \.pie-legend \[role="button"\]\s*\{[^}]*min-width:\s*44px[^}]*min-height:\s*44px/s);
assert.match(css, /\.continuum-shell \.recovery-calibrate-button\s*\{[^}]*min-height:\s*44px/s);
assert.match(css, /\.pwa-time-field\s*>\s*span\s*\{[^}]*white-space:\s*nowrap/s);
assert.match(css, /\.leaderboard-podium-horizon[\s\S]*display:\s*none\s*!important/);
assert.match(css, /prefers-color-scheme:\s*light/);
assert.match(css, /prefers-reduced-transparency:\s*reduce/);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.doesNotMatch(css, /neon|scanline|cyberpunk/i);

assert.match(html, /assets\/gsap\.min\.js/);
assert.match(html, /assets\/ScrollTrigger\.min\.js/);
assert.match(html, /assets\/flight-recorder\.css\?v=20260726-2/);
assert.match(html, /assets\/flight-recorder\.js\?v=20260726-1/);
assert.ok(html.indexOf("gsap.min.js") < html.indexOf("flight-recorder.js"));
assert.ok(html.indexOf("ScrollTrigger.min.js") < html.indexOf("flight-recorder.js"));

dom.window.close();
console.log("quiet continuum interface tests passed");
