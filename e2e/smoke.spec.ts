import { expect, test, type Page } from '@playwright/test'

const IGNORED_CONSOLE = [/THREE\.Clock/, /PCFSoftShadowMap/, /GPU stall/i, /swiftshader/i, /WebGL/i]

const collectErrors = (page: Page): string[] => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !IGNORED_CONSOLE.some((r) => r.test(msg.text()))) errors.push(msg.text())
  })
  return errors
}

const waitForIntro = async (page: Page) => {
  await page.goto('/')
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 150_000 })
}

test('hero loads with the 3D stage and no runtime errors', async ({ page }) => {
  const errors = collectErrors(page)
  await waitForIntro(page)
  await expect(page.getByRole('heading', { level: 1, name: 'Beyond Limits' })).toBeVisible()
  await expect(page.locator('#stage canvas')).toBeVisible()
  await expect(page.getByText('711', { exact: true }).first()).toBeVisible()
  expect(errors).toEqual([])
})

test('page never scrolls horizontally', async ({ page }) => {
  await waitForIntro(page)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('studio controls update the configuration', async ({ page }) => {
  await waitForIntro(page)
  await page.locator('#studio').scrollIntoViewIfNeeded()
  const red = page.getByRole('button', { name: 'Guards Red' })
  await red.click()
  await expect(red).toHaveAttribute('aria-pressed', 'true')
  const night = page.getByRole('button', { name: 'Night', exact: true })
  await night.click()
  await expect(night).toHaveAttribute('aria-pressed', 'true')
})

test('design hotspot list reveals verified detail and closes with Escape', async ({ page }) => {
  await waitForIntro(page)
  await page.locator('#design').scrollIntoViewIfNeeded()
  await page.locator('#design').getByRole('button', { name: /Active rear wing/ }).click()
  await expect(page.getByRole('heading', { name: 'Lift down, drag down' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('heading', { name: 'Lift down, drag down' })).toHaveCount(0)
})

test('gallery opens a fullscreen viewer with keyboard navigation', async ({ page }) => {
  await waitForIntro(page)
  await page.locator('#gallery').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /Open render: Studio · three-quarter front/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(dialog).toHaveAttribute('aria-label', /Render 2 of/)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
})
