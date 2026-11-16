import { kmhToMph, nmToLbFt, psToHp } from '../utils/units'
import type { SourceKey } from './sources'

/**
 * Verified manufacturer figures for the 2026 Porsche 911 Turbo S (992.2) Coupé.
 * Every value is metric as published; imperial values are derived conversions.
 */
export const TURBO_S = {
  systemPowerPs: 711,
  systemPowerKw: 523,
  systemTorqueNm: 800,
  torqueBandRpm: [2300, 6000] as const,
  powerBandRpm: [6500, 7000] as const,
  engineDisplacementL: 3.6,
  enginePowerPs: 640,
  enginePowerKw: 471,
  engineTorqueNm: 760,
  eTurboCount: 2,
  pdkMotorKw: 60,
  pdkMotorNm: 188,
  batteryVoltage: 400,
  batteryGrossKwh: 1.9,
  zeroToHundredS: 2.5,
  topSpeedKmh: 322,
  frontAxleMaxNm: 500,
  dragReductionPct: 10,
  frontArchWidthMm: 45,
  rearArchWidthMm: 20,
} as const

export interface PerformanceStat {
  readonly id: string
  readonly label: string
  readonly value: number
  readonly decimals: number
  readonly unit: string
  /** Converted secondary value, clearly marked as a conversion in the UI. */
  readonly imperial?: string
  readonly note: string
  readonly source: SourceKey
}

export const PERFORMANCE_STATS: readonly PerformanceStat[] = [
  {
    id: 'power',
    label: 'System output',
    value: TURBO_S.systemPowerPs,
    decimals: 0,
    unit: 'PS',
    imperial: String(psToHp(TURBO_S.systemPowerPs)) + ' hp',
    note: String(TURBO_S.systemPowerKw) + ' kW · 6 500–7 000 rpm',
    source: 'powertrain',
  },
  {
    id: 'torque',
    label: 'System torque',
    value: TURBO_S.systemTorqueNm,
    decimals: 0,
    unit: 'Nm',
    imperial: String(nmToLbFt(TURBO_S.systemTorqueNm)) + ' lb-ft',
    note: '2 300–6 000 rpm',
    source: 'powertrain',
  },
  {
    id: 'sprint',
    label: '0–100 km/h',
    value: TURBO_S.zeroToHundredS,
    decimals: 1,
    unit: 's',
    note: 'Manufacturer figure',
    source: 'powertrain',
  },
  {
    id: 'vmax',
    label: 'Top speed',
    value: TURBO_S.topSpeedKmh,
    decimals: 0,
    unit: 'km/h',
    imperial: String(kmhToMph(TURBO_S.topSpeedKmh)) + ' mph',
    note: 'Manufacturer data sheet',
    source: 'datasheet',
  },
]

/** Compact figures used in the hero composition. */
export const HERO_FIGURES = [
  { label: 'System output', value: String(TURBO_S.systemPowerPs), unit: 'PS' },
  { label: '0–100 km/h', value: String(TURBO_S.zeroToHundredS), unit: 's' },
  { label: 'Top speed', value: String(TURBO_S.topSpeedKmh), unit: 'km/h' },
] as const
