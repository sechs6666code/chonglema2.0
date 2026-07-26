import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../assets/flight-recorder.css", import.meta.url), "utf8");
const js = fs.readFileSync(new URL("../assets/flight-recorder.js", import.meta.url), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", import.meta.url), "utf8");
const manifest = JSON.parse(fs.readFileSync(new URL("../manifest.webmanifest", import.meta.url), "utf8"));

assert.match(html, /flight-recorder\.css\?v=20260726-2/);
assert.match(html, /flight-recorder\.js\?v=20260726-1/);
assert.match(html, /gsap\.min\.js\?v=3\.15\.0/);
assert.match(html, /ScrollTrigger\.min\.js\?v=3\.15\.0/);
assert.doesNotMatch(html, /signal-system\.css|signal-field\.js/);
assert.doesNotMatch(serviceWorker, /signal-system\.css|signal-field\.js/);
assert.match(serviceWorker, /gsap\.min\.js/);
assert.match(serviceWorker, /ScrollTrigger\.min\.js/);
assert.match(html, /THESIS:/);
assert.match(html, /Quiet Continuum/);
assert.equal(manifest.theme_color.toLowerCase(), "#0d0e10");
assert.equal(manifest.background_color.toLowerCase(), "#0d0e10");

assert.match(css, /--accent-deep:\s*#0a84ff/i);
assert.match(css, /--green-deep:\s*#24745b/i);
assert.match(css, /--red-deep:\s*#b74e48/i);
assert.match(css, /@font-face[\s\S]*inter-variable\.woff2/);
assert.match(css, /@media \(prefers-color-scheme: light\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media \(prefers-reduced-transparency: reduce\)/);
assert.match(css, /:focus-visible/);
assert.match(css, /\.continuum-dock/);
assert.match(css, /\.choice-indicator/);
assert.match(css, /\.icon-house/);
assert.doesNotMatch(css, /repeating-linear-gradient/i);

assert.match(js, /prefers-reduced-motion/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /MutationObserver/);
assert.match(js, /quiet-continuum/);
assert.match(js, /gsap\.timeline/);
assert.match(js, /gsap\.matchMedia/);
assert.match(js, /ScrollTrigger\.batch/);
assert.match(js, /scrollIntoView/);
assert.doesNotMatch(js, /addEventListener\(["']scroll/);
assert.match(serviceWorker, /flight-recorder\.css/);
assert.match(serviceWorker, /flight-recorder\.js/);
assert.match(serviceWorker, /inter-variable\.woff2/);

console.log("quiet continuum visual system contract tests passed");
