import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("shots");
await fs.mkdir(OUT, { recursive: true });

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3210";

const browser = await chromium.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--force-color-profile=srgb", "--enable-webgl", "--ignore-gpu-blocklist"],
});

const errors = [];

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), animations: "disabled" });
  console.log("shot", name);
}

async function scrollTo(page, selector, offset = 0, wait = 1200) {
  await page.evaluate(
    ({ selector, offset }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true });
      else window.scrollTo(0, top);
    },
    { selector, offset },
  );
  await page.waitForTimeout(wait);
}

async function setup(page, label) {
  page.on("pageerror", (error) => errors.push(`[${label}] pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`[${label}] console: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      errors.push(`[${label}] http ${response.status()}: ${response.url()}`);
    }
  });
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await setup(desktop, "desktop");
await desktop.goto(BASE, { waitUntil: "domcontentloaded" });
await desktop.waitForTimeout(3200);
await shot(desktop, "01-hero.png");

await scrollTo(desktop, "#story", 0, 1600);
await shot(desktop, "02-story.png");
await scrollTo(desktop, "#story", 950, 1400);
await shot(desktop, "03-story-mid.png");
await scrollTo(desktop, "#story", 2100, 1400);
await shot(desktop, "04-story-end.png");

await scrollTo(desktop, "#quality", 0, 1500);
await shot(desktop, "05-quality.png");
await scrollTo(desktop, "#quality", 700, 1200);
await shot(desktop, "06-quality-detail.png");

await scrollTo(desktop, "#collection", 0, 1500);
await shot(desktop, "07-collection-head.png");
await scrollTo(desktop, "#collection", 720, 1500);
await shot(desktop, "08-collection-gallery.png");
await scrollTo(desktop, "#collection", 1600, 1400);
await shot(desktop, "09-collection-scroll.png");

await scrollTo(desktop, "#extensions", 0, 1500);
await shot(desktop, "10-extensions-head.png");
await scrollTo(desktop, "#extensions", 600, 1300);
await shot(desktop, "11-extensions-config.png");

await scrollTo(desktop, "#testimonials", 0, 1400);
await shot(desktop, "12-testimonials.png");

await scrollTo(desktop, "#join", 0, 1500);
await shot(desktop, "13-final.png");

await desktop.goto(`${BASE}/product/midnight-silk`, { waitUntil: "domcontentloaded" });
await desktop.waitForTimeout(2400);
await shot(desktop, "14-pdp.png");
await desktop.getByRole("button", { name: /Show Midnight Silk image 2/ }).click();
await desktop.waitForTimeout(1200);
await shot(desktop, "15-pdp-detail.png");
await desktop.getByRole("button", { name: /Add 1 × Midnight Silk/ }).click();
await desktop.waitForTimeout(1300);
await shot(desktop, "16-cart.png");

await desktop.goto(`${BASE}/checkout`, { waitUntil: "domcontentloaded" });
await desktop.waitForTimeout(1800);
await shot(desktop, "17-checkout.png");
await desktop.evaluate(() => window.scrollTo(0, 700));
await desktop.waitForTimeout(700);
await shot(desktop, "18-checkout-form.png");

await desktop.goto(`${BASE}/does-not-exist`, { waitUntil: "domcontentloaded" });
await desktop.waitForTimeout(1200);
await shot(desktop, "19-404.png");

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
await setup(mobile, "mobile");
await mobile.goto(BASE, { waitUntil: "domcontentloaded" });
await mobile.waitForTimeout(3000);
await shot(mobile, "20-m-hero.png");
await scrollTo(mobile, "#quality", 0, 1500);
await shot(mobile, "21-m-quality.png");
await scrollTo(mobile, "#collection", 0, 1500);
await shot(mobile, "22-m-collection.png");
await scrollTo(mobile, "#collection", 650, 1300);
await shot(mobile, "23-m-collection-scroll.png");
await scrollTo(mobile, "#extensions", 500, 2800);
await shot(mobile, "24-m-extensions.png");
await scrollTo(mobile, "#testimonials", 250, 1200);
await shot(mobile, "25-m-testimonials.png");
await scrollTo(mobile, "#join", 0, 1300);
await shot(mobile, "26-m-final.png");

await mobile.goto(`${BASE}/product/onyx-curl`, { waitUntil: "domcontentloaded" });
await mobile.waitForTimeout(2000);
await shot(mobile, "27-m-pdp.png");

await browser.close();

if (errors.length) {
  console.log("\n--- browser issues ---");
  for (const error of [...new Set(errors)]) console.log(error);
} else {
  console.log("\nNo browser errors.");
}
