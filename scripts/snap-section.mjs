import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/";
const out = process.argv[3] ?? "/tmp/snap-section.png";
const yPos = Number(process.argv[4] ?? 0);
const height = Number(process.argv[5] ?? 600);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1600, height: Math.max(900, height + 200) },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.evaluate((y) => window.scrollTo(0, y), yPos);
await page.waitForTimeout(900);
await page.screenshot({
  path: out,
  clip: { x: 0, y: 0, width: 1600, height },
});
await browser.close();
console.log("ok", out);
