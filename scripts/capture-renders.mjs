// Renders gallery stills from the site's own real-time scene.
// Usage: node scripts/capture-renders.mjs [baseUrl] [--qa]
//   baseUrl defaults to http://localhost:5173 (dev or preview server must be running)
//   --qa   also captures every camera shot into assets-src/qa/ for composition review
//   --only=id1,id2   render a subset of the gallery manifest
import { mkdir, readFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const args = process.argv.slice(2)
const base = args.find((a) => a.startsWith('http')) ?? 'http://localhost:5173'
const qa = args.includes('--qa')
const only = args.find((a) => a.startsWith('--only='))?.slice('--only='.length).split(',')
const OUT = 'public/images/renders'
const SMALL_WIDTH = 1200
const READY_TIMEOUT_MS = 180_000

const gallery = JSON.parse(await readFile('src/data/gallery.json', 'utf8'))
const shots = ['intro', 'hero', 'front', 'profile', 'rear', 'wheel', 'plan', 'design', 'studio', 'finale']

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})

const capture = async ({ shot, env, paint, width, height }) => {
  const page = await browser.newPage({ viewport: { width: width / 2, height: height / 2 }, deviceScaleFactor: 2 })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const url = base + '/?capture=' + shot + '&env=' + env + '&paint=' + paint
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__CAPTURE_READY__ === true, null, { timeout: READY_TIMEOUT_MS })
  const png = await page.screenshot({ type: 'png' })
  await page.close()
  if (errors.length) throw new Error('Page errors for ' + url + ': ' + errors.join('; '))
  return png
}

const writeVariants = async (id, png) => {
  const img = sharp(png)
  await Promise.all([
    img.clone().avif({ quality: 58, effort: 6 }).toFile(OUT + '/' + id + '-lg.avif'),
    img.clone().webp({ quality: 80 }).toFile(OUT + '/' + id + '-lg.webp'),
    img.clone().resize({ width: SMALL_WIDTH }).avif({ quality: 55, effort: 6 }).toFile(OUT + '/' + id + '-sm.avif'),
    img.clone().resize({ width: SMALL_WIDTH }).webp({ quality: 78 }).toFile(OUT + '/' + id + '-sm.webp'),
  ])
}

try {
  await mkdir(OUT, { recursive: true })
  if (qa) {
    await mkdir('assets-src/qa', { recursive: true })
    for (const shot of shots) {
      const png = await capture({ shot, env: 'studio', paint: 'carrara-white', width: 1600, height: 900 })
      await sharp(png).resize({ width: 960 }).jpeg({ quality: 80 }).toFile('assets-src/qa/' + shot + '.jpg')
      console.log('qa', shot)
    }
  } else {
    for (const item of gallery.filter((g) => !only || only.includes(g.id))) {
      const png = await capture(item)
      await writeVariants(item.id, png)
      if (item.id === 'hero-studio') {
        await sharp(png).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile('public/og-image.jpg')
      }
      console.log('rendered', item.id)
    }
    await sharp('public/favicon.svg').resize(180, 180).png().toFile('public/apple-touch-icon.png')
  }
} finally {
  await browser.close()
}
