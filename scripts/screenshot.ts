/* eslint-disable */
/**
 * Visual audit — screenshots every key route at desktop + mobile.
 * Usage: npx tsx scripts/screenshot.ts
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = path.resolve(process.cwd(), "screenshots");

const ROUTES: { path: string; name: string }[] = [
  { path: "/", name: "feed" },
  { path: "/discover", name: "discover" },
  { path: "/search?q=charizard", name: "search" },
  { path: "/cards/base1-4", name: "card-detail" },
  { path: "/auth/sign-in", name: "sign-in" },
  { path: "/auth/sign-up", name: "sign-up" },
  { path: "/preview", name: "preview" },
  { path: "/collection", name: "collection" },
  { path: "/wishlist", name: "wishlist" },
  { path: "/matches", name: "matches" },
  { path: "/notifications", name: "notifications" },
  { path: "/post/new", name: "post-new" },
  { path: "/ads/new", name: "ads-new" },
  { path: "/trades", name: "trades" },
  { path: "/onboarding", name: "onboarding" },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 393, height: 852 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2,
    });

    // Sign in once in this context; the cookie is shared with subsequent pages.
    const auth = await ctx.newPage();
    await auth.goto(`${BASE}/auth/sign-in`, { waitUntil: "domcontentloaded" });
    const csrf = await auth
      .evaluate(() => fetch("/api/auth/csrf").then((r) => r.json()))
      .catch(() => null);
    if (csrf?.csrfToken) {
      const params = new URLSearchParams({
        csrfToken: csrf.csrfToken,
        email: "demo@demo.com",
        password: "demo1234",
        json: "true",
      });
      await auth.evaluate(
        (body) =>
          fetch("/api/auth/callback/credentials", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
          }),
        params.toString()
      );
    }
    await auth.close();

    // Verify sign-in worked
    const check = await ctx.newPage();
    await check.goto(`${BASE}/api/auth/session`, { waitUntil: "networkidle" });
    const sessionText = await check.textContent("body");
    const isAuthed = sessionText?.includes('"email"');
    await check.close();
    console.log(`  [${viewport.name}] authed=${isAuthed}`);

    for (const r of ROUTES) {
      const url = `${BASE}${r.path}`;
      const p = await ctx.newPage();
      try {
        await p.goto(url, { waitUntil: "networkidle", timeout: 25000 });
        const isFull = r.path !== "/" && !r.path.startsWith("/preview");
        if (isFull) {
          // Scroll the page end-to-end so in-view animations fire
          await p.evaluate(async () => {
            const distance = 500;
            const delay = 80;
            for (let y = 0; y < document.body.scrollHeight; y += distance) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, delay));
            }
            window.scrollTo(0, 0);
            await new Promise((r) => setTimeout(r, 300));
          });
        }
        await p.waitForTimeout(2000); // let animations settle
        const file = path.join(OUT, `${viewport.name}-${r.name}.png`);
        await p.screenshot({
          path: file,
          fullPage: isFull,
        });
        console.log(`✓ ${viewport.name}/${r.name}`);
      } catch (e) {
        console.log(`✗ ${viewport.name}/${r.name}: ${(e as Error).message}`);
      } finally {
        await p.close();
      }
    }
    await ctx.close();
  }

  await browser.close();
  console.log(`\n📸 saved to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
