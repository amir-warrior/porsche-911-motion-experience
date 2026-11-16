import { arcPath, GAUGE, polar, tickValues, valueToDeg } from './gauge'
import { TURBO_S } from '../../data/specs'

/**
 * Illustrative gauge. The arc stops at the published top speed; it is a
 * typographic visualization of a figure, not live or recorded telemetry.
 */
export const Speedometer = () => {
  const vmax = TURBO_S.topSpeedKmh
  const [nx, ny] = polar(valueToDeg(vmax), GAUGE.r - 26)
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full" role="img" aria-labelledby="gauge-title">
      <title id="gauge-title">Speedometer graphic marking the published top speed of {vmax} km/h</title>
      <path d={arcPath(GAUGE.max)} className="fill-none stroke-line" strokeWidth={1} />
      {tickValues(10).map((v) => {
        const major = v % 40 === 0
        const [x0, y0] = polar(valueToDeg(v), GAUGE.r - (major ? 14 : 8))
        const [x1, y1] = polar(valueToDeg(v), GAUGE.r)
        const [lx, ly] = polar(valueToDeg(v), GAUGE.r - 32)
        return (
          <g key={v}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} className={v > vmax ? 'stroke-line' : 'stroke-line-strong'} strokeWidth={major ? 1.5 : 1} />
            {major ? (
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-mute font-mono text-[10px]">
                {v}
              </text>
            ) : null}
          </g>
        )
      })}
      <path data-gauge-arc d={arcPath(vmax, GAUGE.r + 10)} pathLength={1} strokeDasharray="1" strokeDashoffset={1} className="fill-none stroke-accent" strokeWidth={3} />
      <line data-gauge-needle x1={GAUGE.cx} y1={GAUGE.cy} x2={nx} y2={ny} className="stroke-paper" strokeWidth={1.5} style={{ transformOrigin: '200px 200px' }} />
      <circle cx={GAUGE.cx} cy={GAUGE.cy} r={4} className="fill-paper" />
      <text x={GAUGE.cx} y={GAUGE.cy + 92} textAnchor="middle" className="fill-mute font-mono text-[10px] tracking-[0.2em]">
        KM/H
      </text>
    </svg>
  )
}
