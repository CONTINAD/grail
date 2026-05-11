import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/";
const out = process.argv[3] ?? "/tmp/snap-clip.png";
const x = Number(process.argv[4] ?? 0);
const y = Number(process.argv[5] ?? 0);
const w = Number(process.argv[6] ?? 800);
const h = Number(process.argv[7] ?? 600);
const scrollY = Number(process.argv[8] ?? 0);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
if (scrollY) {
  await page.evaluate((sy) => window.scrollTo(0, sy), scrollY);
  await page.waitForTimeout(900);
}
await page.screenshot({ path: out, clip: { x, y, width: w, height: h } });
await browser.close();
console.log("ok", out);
