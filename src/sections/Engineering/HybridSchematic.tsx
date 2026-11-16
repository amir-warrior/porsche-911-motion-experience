import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import type { EngineeringStep } from '../../data/engineering'

const FLOWS: Record<string, string> = {
  'battery-turbo-l': 'M380 250 C470 250 480 140 560 140 L788 140',
  'battery-turbo-r': 'M380 270 C470 270 480 380 560 380 L788 380',
  'battery-pdk': 'M380 260 L562 260',
  'drive-rear': 'M660 260 L705 260 M705 104 L705 416',
  'drive-front': 'M562 292 L210 292 M210 104 L210 416',
}

const Wheel = ({ x, y }: { x: number; y: number }) => (
  <rect x={x - 42} y={y} width={84} height={36} rx={6} className="fill-none stroke-line-strong" />
)

/**
 * Top-view schematic of the T-Hybrid layout (nose on the left).
 * Illustrative only: positions are simplified and the animation shows which
 * components are involved — it is not a mechanical or energy simulation.
 */
export const HybridSchematic = ({ step, reduced }: { step: EngineeringStep; reduced: boolean }) => {
  const svg = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const duration = reduced ? 0 : 0.9
      gsap.to('[data-part]', {
        opacity: (_, el: Element) => ((step.parts as readonly string[]).includes(el.getAttribute('data-part') ?? '') ? 1 : 0.18),
        duration,
        ease: 'power2.out',
      })
      gsap.to('[data-flow]', {
        strokeDashoffset: (_, el: Element) => (step.flows.includes(el.getAttribute('data-flow') ?? '') ? 0 : 1),
        duration: reduced ? 0 : 1.2,
        ease: 'power3.inOut',
      })
      gsap.to('[data-pulse]', {
        opacity: (_, el: Element) => (step.flows.includes(el.getAttribute('data-pulse') ?? '') && !reduced ? 1 : 0),
        duration,
      })
    },
    { scope: svg, dependencies: [step, reduced] },
  )

  return (
    <svg ref={svg} viewBox="0 0 1000 520" role="img" aria-labelledby="schematic-title" className="h-auto w-full">
      <title id="schematic-title">
        Simplified top-view schematic of the T-Hybrid powertrain: boxer engine with two eTurbos, PDK with
        integrated electric motor, high-voltage battery, front and rear axles.
      </title>
      <path
        d="M110 260 C110 150 150 70 260 62 L780 62 C880 66 930 140 930 260 C930 380 880 454 780 458 L260 458 C150 450 110 370 110 260 Z"
        className="fill-none stroke-line"
        strokeDasharray="4 6"
      />
      <g data-part="front">
        <Wheel x={210} y={66} />
        <Wheel x={210} y={418} />
        <text x={210} y={500} textAnchor="middle" className="fill-mute font-mono text-[13px] tracking-[0.18em]">FRONT AXLE</text>
      </g>
      <g data-part="rear">
        <Wheel x={705} y={66} />
        <Wheel x={705} y={418} />
        <text x={705} y={500} textAnchor="middle" className="fill-mute font-mono text-[13px] tracking-[0.18em]">REAR AXLE</text>
      </g>
      <g data-part="battery">
        <rect x={290} y={222} width={90} height={76} className="fill-ink-2 stroke-paper" />
        <path d="M312 246 h46 M312 260 h46 M312 274 h46" className="stroke-line-strong" />
        <text x={335} y={210} textAnchor="middle" className="fill-paper font-mono text-[13px] tracking-[0.18em]">400 V</text>
      </g>
      <g data-part="pdk">
        <rect x={562} y={222} width={98} height={76} className="fill-ink-2 stroke-paper" />
        <circle cx={611} cy={260} r={20} className="fill-none stroke-accent" strokeWidth={2} />
        <text x={611} y={210} textAnchor="middle" className="fill-paper font-mono text-[13px] tracking-[0.18em]">PDK + E</text>
      </g>
      <g data-part="engine">
        <rect x={750} y={176} width={150} height={168} className="fill-ink-2 stroke-paper" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={784 + i * 41} cy={214} r={13} className="fill-none stroke-line-strong" />
            <circle cx={784 + i * 41} cy={306} r={13} className="fill-none stroke-line-strong" />
          </g>
        ))}
        <text x={825} y={265} textAnchor="middle" className="fill-paper font-mono text-[13px] tracking-[0.18em]">3.6 BOXER</text>
      </g>
      <g data-part="turbo">
        <circle cx={812} cy={140} r={24} className="fill-ink-2 stroke-accent" strokeWidth={2} />
        <circle cx={812} cy={380} r={24} className="fill-ink-2 stroke-accent" strokeWidth={2} />
        <text x={860} y={128} className="fill-paper font-mono text-[13px] tracking-[0.18em]">eTURBO</text>
        <text x={860} y={404} className="fill-paper font-mono text-[13px] tracking-[0.18em]">eTURBO</text>
      </g>
      {Object.entries(FLOWS).map(([id, d]) => (
        <g key={id}>
          <path data-flow={id} d={d} pathLength={1} strokeDasharray="1" strokeDashoffset={1} className="fill-none stroke-paper" strokeWidth={1.5} />
          <path
            data-pulse={id}
            d={d}
            pathLength={1}
            opacity={0}
            className="animate-[flowpulse_1.8s_linear_infinite] fill-none stroke-accent"
            strokeWidth={3}
            strokeDasharray="0.05 0.95"
          />
        </g>
      ))}
    </svg>
  )
}
