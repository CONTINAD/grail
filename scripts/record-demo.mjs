import { chromium } from "playwright";
import { mkdir, rm, readdir, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const URL = process.env.DEMO_URL ?? "http://localhost:3457/demo";
const OUT_DIR = process.env.OUT_DIR ?? "/Users/alexaustin/Desktop/Trade/public/demo-ad";
const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION_MS = 43_500; // 8 scenes × ~5s + tail
const TAIL_MS = 1_500;

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

console.log("→ Launching headed browser at", `${WIDTH}x${HEIGHT}`);
const browser = await chromium.launch({
  args: [
    "--disable-blink-features=AutomationControlled",
    "--autoplay-policy=no-user-gesture-required",
  ],
});

const tmpVidDir = join(OUT_DIR, ".raw");
if (existsSync(tmpVidDir)) await rm(tmpVidDir, { recursive: true, force: true });
await mkdir(tmpVidDir, { recursive: true });

const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
  recordVideo: { dir: tmpVidDir, size: { width: WIDTH, height: HEIGHT } },
  reducedMotion: "no-preference",
  colorScheme: "dark",
});

const page = await ctx.newPage();

console.log("→ Navigating to", URL);
await page.goto(URL, { waitUntil: "networkidle" });

// Hide demo HUD chrome (z-50 = top brand + bottom controls; z-40 = done overlay).
// Scenes use z-10/z-20 only, so this is safe. Also hide Next.js dev indicators.
await page.addStyleTag({ content: `
  body { background: #000 !important; cursor: none !important; }
  .z-50, .z-40 { display: none !important; }
  nextjs-portal,
  #__next-build-watcher,
  div[data-nextjs-toast],
  div[data-nextjs-dialog-overlay],
  div[data-next-mark],
  [data-next-badge-root] { display: none !important; visibility: hidden !important; }
` });

console.log("→ Recording for", DURATION_MS, "ms");
await page.waitForTimeout(DURATION_MS);

const video = page.video();
await page.waitForTimeout(TAIL_MS);
await ctx.close();
await browser.close();

if (!video) throw new Error("no video object on page");
const webm = await video.path();
console.log("→ Raw WebM:", webm);

// Move webm to a known name
const webmFinal = join(OUT_DIR, "grail-ad.webm");
await rename(webm, webmFinal);

const mp4Final = join(OUT_DIR, "grail-ad.mp4");
console.log("→ Converting to MP4:", mp4Final);

await new Promise((resolve, reject) => {
  const ff = spawn("ffmpeg", [
    "-y",
    "-i", webmFinal,
    "-vf", "scale=1920:1080:flags=lanczos,format=yuv420p",
    "-r", "30",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    mp4Final,
  ], { stdio: ["ignore", "inherit", "inherit"] });
  ff.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("ffmpeg exit " + code))));
});

// Make a 6-second silent loop preview gif as well
const gifFinal = join(OUT_DIR, "grail-ad.gif");
console.log("→ Building GIF preview:", gifFinal);
await new Promise((resolve, reject) => {
  const ff = spawn("ffmpeg", [
    "-y",
    "-ss", "1",
    "-t", "10",
    "-i", mp4Final,
    "-vf", "fps=18,scale=720:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
    "-loop", "0",
    gifFinal,
  ], { stdio: ["ignore", "inherit", "inherit"] });
  ff.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("ffmpeg exit " + code))));
});

await rm(tmpVidDir, { recursive: true, force: true });

const files = await readdir(OUT_DIR);
console.log("\n✓ Done. Outputs:");
for (const f of files) console.log("  ", join(OUT_DIR, f));
