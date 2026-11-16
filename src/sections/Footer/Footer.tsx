import { SITE } from '../../data/site'
import { SOURCES } from '../../data/sources'

const linkClass = 'underline decoration-line-strong underline-offset-4 transition-colors hover:text-paper'

export const Footer = () => (
  <footer className="relative z-10 border-t border-line bg-ink px-gutter pt-12 pb-10">
    <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <p className="type-headline text-2xl">911 — Beyond Limits</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
          An independent, unofficial portfolio concept. Not affiliated with, endorsed by or connected to
          Dr. Ing. h.c. F. Porsche AG. Porsche, 911 and Turbo S are trademarks of their respective owner and are
          used here for identification only.
        </p>
      </div>
      <div className="text-sm text-mute">
        <p className="type-label mb-3 text-paper">3D model</p>
        <p>
          <a className={linkClass} href={SITE.model.url} target="_blank" rel="noreferrer">
            {SITE.model.title}
          </a>{' '}
          by {SITE.model.author}, licensed{' '}
          <a className={linkClass} href={SITE.model.licenseUrl} target="_blank" rel="noreferrer">
            {SITE.model.license}
          </a>
          . Optimized and re-materialed for the web; it depicts the earlier 992.1 body.
        </p>
      </div>
      <div className="text-sm text-mute">
        <p className="type-label mb-3 text-paper">Data</p>
        <p>
          Specifications from the{' '}
          <a className={linkClass} href={SOURCES.pressKit} target="_blank" rel="noreferrer">
            official Porsche Newsroom press kit
          </a>
          . Imperial values are conversions. Renders are generated from this site's real-time scene.
        </p>
      </div>
    </div>
    <div className="type-label mt-12 flex flex-wrap justify-between gap-4 text-mute">
      <span>© 2026 · Built by {SITE.author}</span>
      <a className={linkClass} href={SITE.repoUrl} target="_blank" rel="noreferrer">
        Source on GitHub
      </a>
    </div>
  </footer>
)
