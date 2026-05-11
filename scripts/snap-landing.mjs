import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3457/";
const out = process.argv[3] ?? "/tmp/snap-landing.png";
const fullPage = process.argv[4] === "full";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.screenshot({ path: out, fullPage });
await browser.close();
console.log("ok", out);
