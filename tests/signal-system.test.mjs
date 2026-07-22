import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../assets/signal-system.css", import.meta.url), "utf8");
const js = fs.readFileSync(new URL("../assets/signal-field.js", import.meta.url), "utf8");
const flightCss = fs.readFileSync(new URL("../assets/flight-recorder.css", import.meta.url), "utf8");
const flightJs = fs.readFileSync(new URL("../assets/flight-recorder.js", import.meta.url), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const manifest = JSON.parse(fs.readFileSync(new URL("../manifest.webmanifest", import.meta.url), "utf8"));

assert.match(html, /signal-system\.css\?v=20260722-4/);
assert.match(html, /signal-field\.js\?v=20260722-4/);
assert.match(html, /flight-recorder\.css\?v=20260722-4/);
assert.match(html, /flight-recorder\.js\?v=20260722-4/);
assert.doesNotMatch(html, /gsap(?:\.min|-motion)|Flip\.min|ScrollTrigger\.min/);
assert.doesNotMatch(serviceWorker, /gsap(?:\.min|-motion)|Flip\.min|ScrollTrigger\.min/);
assert.equal(packageJson.dependencies?.gsap, undefined);
assert.match(html, /THESIS:/);
assert.equal(manifest.theme_color, "#080907");
assert.equal(manifest.background_color, "#080907");

assert.match(css, /--green:\s*#42f5b3/i);
assert.match(css, /--red:\s*#ff746c/i);
assert.match(css, /@media \(prefers-color-scheme: light\)/);
assert.match(css, /--green:\s*#087a55/i);
assert.match(css, /--red:\s*#b83e38/i);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /:focus-visible/);
assert.match(css, /\.shell\s*\{/);
assert.match(css, /\.rb-reveal/);
assert.match(css, /--spot-x/);

assert.match(js, /prefers-reduced-motion/);
assert.match(js, /prefers-color-scheme: dark/);
assert.match(js, /syncThemePalette/);
assert.match(js, /devicePixelRatio/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /MutationObserver/);
assert.match(js, /signal-effects/);
assert.match(js, /pointerdown/);
assert.match(js, /visibilitychange/);
assert.doesNotMatch(js, /gsap/i);
assert.match(flightCss, /--green:\s*#d8ff3e/i);
assert.match(flightCss, /--red:\s*#ff6047/i);
assert.match(flightCss, /--accent:\s*#6acbff/i);
assert.match(flightCss, /--green:\s*#506f00/i);
assert.match(flightCss, /\.flight-dock/);
assert.match(flightCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(flightJs, /IntersectionObserver/);
assert.match(flightJs, /scrollIntoView/);
assert.doesNotMatch(flightJs, /gsap/i);
assert.match(serviceWorker, /flight-recorder\.css/);
assert.match(serviceWorker, /flight-recorder\.js/);

console.log("signal system contract tests passed");
