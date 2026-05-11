import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
const page = await ctx.newPage();
await page.goto("http://localhost:3010/demo", { waitUntil: "networkidle", timeout: 30000 });

// Scene durations (ms)
const scenes = [
  { id: "open",    midway: 1800 },
  { id: "cover",   midway: 4500 },
  { id: "marcus",  midway: 4000 },
  { id: "ledger",  midway: 4000 },
  { id: "match",   midway: 4500 },
  { id: "ad",      midway: 3500 },
  { id: "wall",    midway: 2500 },
  { id: "stamp",   midway: 2500 },
];

let cum = 0;
for (let i = 0; i < scenes.length; i++) {
  // total elapsed = sum of prior full scenes + midway of current
  const prior = i === 0 ? 0 : scenes.slice(0, i).reduce((s, x) => s + x.midway * 2, 0);
  const target = prior + scenes[i].midway;
  console.log(`scene ${i} (${scenes[i].id}): waiting ~${target - cum}ms total ~${target}ms`);
  // wait additional time
  await page.waitForTimeout(target - cum);
  await page.screenshot({ path: `/tmp/grail-screenshots/demo-${String(i + 1).padStart(2, "0")}-${scenes[i].id}.png` });
  cum = target;
}

await browser.close();
