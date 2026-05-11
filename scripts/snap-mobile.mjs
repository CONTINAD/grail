import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:3457/";
const out = process.argv[3] ?? "/tmp/snap-mobile.png";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log("ok", out);
