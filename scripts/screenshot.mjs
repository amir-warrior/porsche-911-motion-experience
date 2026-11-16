// Captures a real screenshot of the running site's hero for the README.
// Usage: node scripts/screenshot.mjs [baseUrl]
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const base = process.argv[2] ?? 'http://localhost:5173'
const INTRO_SETTLE_MS = 6000

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.getByRole('status').waitFor({ state: 'detached', timeout: 240_000 })
  await page.waitForTimeout(INTRO_SETTLE_MS)
  const png = await page.screenshot({ type: 'png' })
  await sharp(png).jpeg({ quality: 84 }).toFile('docs/screenshot-hero.jpg')
  console.log('saved docs/screenshot-hero.jpg')
} finally {
  await browser.close()
}
