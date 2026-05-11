import { chromium } from "playwright";

// Scene mid-points based on real durations (ms)
// open 3200, cover 5800, marcus 5400, ledger 5800, match 5600, ad 5400, wall 4200, stamp 4800
const scenes = [
  { id: "01-open",    waitMs: 1800 },
  { id: "02-cover",   waitMs: 6500 },   // cumulative: 8300
  { id: "03-marcus",  waitMs: 5700 },   // 14000
  { id: "04-ledger",  waitMs: 5800 },   // 19800
  { id: "05-match",   waitMs: 5800 },   // 25600
  { id: "06-ad",      waitMs: 5600 },   // 31200
  { id: "07-wall",    waitMs: 4200 },   // 35400
  { id: "08-stamp",   waitMs: 3500 },   // 38900
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
const page = await ctx.newPage();
await page.goto("http://localhost:3010/demo", { waitUntil: "networkidle", timeout: 30000 });

let cum = 0;
for (const s of scenes) {
  cum += s.waitMs;
  await page.waitForTimeout(s.waitMs);
  await page.screenshot({ path: `/tmp/grail-screenshots/v2-demo-${s.id}.png` });
  console.log(`${s.id} captured @ ~${cum}ms`);
}
await browser.close();
