import assert from "node:assert/strict";
import fs from "node:fs";
import { JSDOM } from "jsdom";

const source = fs.readFileSync(new URL("../assets/flight-recorder.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../assets/flight-recorder.css", import.meta.url), "utf8");

const dom = new JSDOM(`<!doctype html><html><body><div id="root"><main class="shell">
  <header class="topbar"><button class="leaderboard-trigger">排行榜</button><button class="more">更多</button></header>
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

assert.equal(window.document.documentElement.dataset.visualSystem, "flight-recorder");
assert.equal(window.document.querySelector(".flight-wordmark strong").textContent, "冲了吗");
assert.match(window.document.querySelector(".flight-wordmark span").textContent, /记录仅存本机/);
assert.equal(window.document.querySelectorAll(".flight-dock button").length, 4);
assert.equal(window.document.querySelector(".flight-dock button.is-active").dataset.route, "today");
assert.equal(window.document.querySelector(".stats").dataset.flightZone, "trend");
assert.equal(window.document.querySelector("#recovery-vault").dataset.flightZone, "recovery");
assert.equal(window.document.querySelector(".history").getAttribute("aria-label"), "打卡记录带");
assert.ok(window.document.querySelector(".pwa-reminder-entry").classList.contains("flight-command-row"));

window.document.querySelector('[data-route="trend"]').click();
assert.equal(scrolledTarget, window.document.querySelector(".stats"));
assert.equal(window.document.querySelector(".flight-dock button.is-active").dataset.route, "trend");

assert.match(css, /--surface-radius:\s*12px/);
assert.match(css, /--control-radius:\s*8px/);
assert.match(css, /min-height:\s*44px/);
assert.match(css, /prefers-color-scheme: light/);
assert.match(css, /prefers-reduced-transparency: reduce/);

dom.window.close();
console.log("flight recorder interface tests passed");
