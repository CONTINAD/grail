import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3457/";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const vh = 900;
let i = 0;
for (let y = 0; y < total; y += vh) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `/tmp/snap-${String(i).padStart(2, "0")}.png` });
  i++;
}
await browser.close();
console.log("ok", i, "shots, total height", total);
