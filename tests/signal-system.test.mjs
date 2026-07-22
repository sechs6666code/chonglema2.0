import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../assets/flight-recorder.css", import.meta.url), "utf8");
const js = fs.readFileSync(new URL("../assets/flight-recorder.js", import.meta.url), "utf8");
const serviceWorker = fs.readFileSync(new URL("../sw.js", import.meta.url), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const manifest = JSON.parse(fs.readFileSync(new URL("../manifest.webmanifest", import.meta.url), "utf8"));

assert.match(html, /flight-recorder\.css\?v=20260722-9/);
assert.match(html, /flight-recorder\.js\?v=20260722-9/);
assert.doesNotMatch(html, /signal-system\.css|signal-field\.js/);
assert.doesNotMatch(html, /gsap(?:\.min|-motion)|Flip\.min|ScrollTrigger\.min/);
assert.doesNotMatch(serviceWorker, /signal-system\.css|signal-field\.js/);
assert.doesNotMatch(serviceWorker, /gsap(?:\.min|-motion)|Flip\.min|ScrollTrigger\.min/);
assert.equal(packageJson.dependencies?.gsap, undefined);
assert.match(html, /THESIS:/);
assert.match(html, /电子手账/);
assert.equal(manifest.theme_color, "#171716");
assert.equal(manifest.background_color, "#171716");

assert.match(css, /--accent:\s*#7775e7/i);
assert.match(css, /--green:\s*#5ea984/i);
assert.match(css, /--red:\s*#df756f/i);
assert.match(css, /@media \(prefers-color-scheme: light\)/);
assert.match(css, /--accent:\s*#5856d6/i);
assert.match(css, /--green:\s*#34745a/i);
assert.match(css, /--red:\s*#b94b45/i);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /:focus-visible/);
assert.match(css, /\.quiet-reveal/);
assert.doesNotMatch(css, /repeating-linear-gradient\([^)]*47px/i);

assert.match(js, /prefers-reduced-motion/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /MutationObserver/);
assert.match(js, /quiet-ledger/);
assert.match(js, /scrollIntoView/);
assert.doesNotMatch(js, /canvas|getContext|devicePixelRatio|gsap/i);
assert.match(serviceWorker, /flight-recorder\.css/);
assert.match(serviceWorker, /flight-recorder\.js/);

console.log("quiet visual system contract tests passed");
