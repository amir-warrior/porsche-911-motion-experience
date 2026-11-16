import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { registerReveals } from '../../animations/scroll/reveals'

import { SectionLabel } from '../../components/UI/SectionLabel'
import { SplitWords } from '../../components/UI/SplitWords'
import { PERFORMANCE_STATS, TURBO_S } from '../../data/specs'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { valueToDeg } from './gauge'
import { Speedometer } from './Speedometer'

const formatStat = (value: number, decimals: number) => value.toFixed(decimals)

/** Performance: verified figures as animated counters plus an illustrative gauge. */
export const Performance = () => {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      registerReveals(section, reduced)

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const decimals = Number(el.dataset.decimals ?? 0)
        if (reduced) {
          el.textContent = formatStat(target, decimals)
          return
        }
        el.textContent = formatStat(0, decimals)
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target,
          duration: 2.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = formatStat(counter.v, decimals)
          },
        })
      })

      const gauge = { trigger: '[data-gauge]', start: 'top 75%', end: 'bottom 45%', scrub: reduced ? false : 0.8 }
      const needleFrom = valueToDeg(0) - valueToDeg(TURBO_S.topSpeedKmh)
      if (reduced) {
        gsap.set('[data-gauge-arc]', { strokeDashoffset: 0 })
      } else {
        gsap.to('[data-gauge-arc]', { strokeDashoffset: 0, ease: 'none', scrollTrigger: gauge })
        gsap.from('[data-gauge-needle]', { rotate: needleFrom, ease: 'none', scrollTrigger: gauge })
      }
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} id="performance" aria-labelledby="performance-title" className="relative z-10 bg-ink px-gutter pt-24 pb-32 md:pt-32 md:pb-44">
      <div className="h-px w-full bg-line" aria-hidden="true" />
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <SectionLabel index="05">Performance</SectionLabel>
          <div data-split-heading className="mt-8">
            <SplitWords as="h2" id="performance-title" text={'Measured in\ntenths'} className="type-headline text-[13vw] md:text-[7vw]" />
          </div>
          <div data-gauge data-reveal className="mt-10 max-w-md md:mt-16">
            <Speedometer />
            <p className="type-label mt-2 text-mute">Illustrative gauge · published top speed, not telemetry</p>
          </div>
        </div>

        <dl className="grid content-end gap-x-8 sm:grid-cols-2">
          {PERFORMANCE_STATS.map((stat) => (
            <div key={stat.id} data-reveal className="border-t border-line py-8 md:py-10">
              <dt className="type-label text-mute">{stat.label}</dt>
              <dd className="mt-4">
                <span className="flex items-baseline gap-2">
                  <span data-count={stat.value} data-decimals={stat.decimals} className="type-display tabular text-7xl md:text-8xl">
                    {formatStat(stat.value, stat.decimals)}
                  </span>
                  <span className="type-label text-paper">{stat.unit}</span>
                </span>
                <span className="type-label mt-4 flex flex-wrap gap-x-3 gap-y-1 text-mute">
                  {stat.imperial ? <span>≈ {stat.imperial} (converted)</span> : null}
                  <span>{stat.note}</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
