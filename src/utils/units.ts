/**
 * Unit conversions used to derive the clearly-labelled imperial values.
 * Manufacturer figures are metric; imperial values are converted, never sourced.
 */
const PS_TO_HP = 0.98632 // 1 PS = 0.98632 mechanical hp
const NM_TO_LBFT = 0.737562
const KMH_TO_MPH = 0.621371

export const psToHp = (ps: number): number => Math.round(ps * PS_TO_HP)
export const nmToLbFt = (nm: number): number => Math.round(nm * NM_TO_LBFT)
export const kmhToMph = (kmh: number): number => Math.round(kmh * KMH_TO_MPH)

/** Format numbers with a thin locale-independent grouping (e.g. 2 300). */
export const formatNumber = (value: number, decimals = 0): string => {
  const fixed = value.toFixed(decimals)
  const [int = '0', frac] = fixed.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return frac ? `${grouped}.${frac}` : grouped
}
