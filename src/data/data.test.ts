import { describe, expect, it } from 'vitest'
import { ENVIRONMENT_ORDER, ENVIRONMENTS, isEnvironmentId } from './environments'
import { findHotspot, HOTSPOTS } from './hotspots'
import { JOURNEY_CHAPTERS } from './journey'
import { findPaint, findWheel, PAINTS, WHEEL_FINISHES } from './paints'
import { JOURNEY_SHOTS, SHOTS, STUDIO_PRESETS } from './shots'
import { SOURCES } from './sources'
import { HERO_FIGURES, PERFORMANCE_STATS, TURBO_S } from './specs'

describe('verified specifications', () => {
  it('match the official press kit figures', () => {
    expect(TURBO_S.systemPowerPs).toBe(711)
    expect(TURBO_S.systemPowerKw).toBe(523)
    expect(TURBO_S.systemTorqueNm).toBe(800)
    expect(TURBO_S.engineDisplacementL).toBe(3.6)
    expect(TURBO_S.zeroToHundredS).toBe(2.5)
    expect(TURBO_S.topSpeedKmh).toBe(322)
  })

  it('label imperial values as derived conversions', () => {
    expect(PERFORMANCE_STATS.find((s) => s.id === 'power')?.imperial).toBe('701 hp')
    expect(PERFORMANCE_STATS.find((s) => s.id === 'torque')?.imperial).toBe('590 lb-ft')
    expect(PERFORMANCE_STATS.find((s) => s.id === 'vmax')?.imperial).toBe('200 mph')
  })

  it('cite a known source for every stat and hotspot', () => {
    for (const item of [...PERFORMANCE_STATS, ...HOTSPOTS]) {
      expect(SOURCES[item.source]).toMatch(/^https:\/\/newsroom\.porsche\.com\//)
    }
  })

  it('exposes hero figures from the same source of truth', () => {
    expect(HERO_FIGURES.map((f) => f.value)).toEqual(['711', '2.5', '322'])
  })
})

describe('configurator data', () => {
  it('has unique ids and falls back to the first option', () => {
    expect(new Set(PAINTS.map((p) => p.id)).size).toBe(PAINTS.length)
    expect(new Set(WHEEL_FINISHES.map((w) => w.id)).size).toBe(WHEEL_FINISHES.length)
    expect(findPaint('unknown')).toBe(PAINTS[0])
    expect(findWheel('unknown')).toBe(WHEEL_FINISHES[0])
    expect(findPaint('guards-red').name).toBe('Guards Red')
  })

  it('defines every environment in order', () => {
    expect(ENVIRONMENT_ORDER.every((id) => ENVIRONMENTS[id].id === id)).toBe(true)
    expect(isEnvironmentId('night')).toBe(true)
    expect(isEnvironmentId('noon')).toBe(false)
    expect(isEnvironmentId(3)).toBe(false)
  })
})

describe('story data', () => {
  it('has one journey chapter per composition after the hero', () => {
    expect(JOURNEY_SHOTS.length).toBe(JOURNEY_CHAPTERS.length + 1)
  })

  it('references valid studio presets and hotspots', () => {
    for (const preset of STUDIO_PRESETS) expect(SHOTS[preset.id]).toBeDefined()
    expect(findHotspot('rear-wing')?.title).toBeTruthy()
    expect(findHotspot(null)).toBeUndefined()
    expect(new Set(HOTSPOTS.map((h) => h.id)).size).toBe(HOTSPOTS.length)
  })
})

describe('engineering and site data', async () => {
  const { ENGINEERING_STEPS } = await import('./engineering')
  const { NAV_LINKS, SITE } = await import('./site')

  it('steps quote verified figures', () => {
    expect(ENGINEERING_STEPS).toHaveLength(4)
    expect(ENGINEERING_STEPS[3]!.figures[0]!.value).toBe('523 kW')
  })

  it('credits the model licence and links every nav target', () => {
    expect(SITE.model.license).toBe('CC BY 4.0')
    expect(NAV_LINKS.map((l) => l.id)).toContain('studio')
  })
})
