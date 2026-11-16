/**
 * Shown when WebGL is unavailable or the 3D stage fails. It is explicitly a
 * still render — the UI says so, rather than pretending to be interactive 3D.
 */
export const StageFallback = () => (
  <div className="absolute inset-0 bg-ink">
    <picture>
      <source srcSet="/images/renders/hero-studio-lg.avif" type="image/avif" />
      <img
        src="/images/renders/hero-studio-lg.webp"
        alt="Still render of the 911 Turbo S in a dark studio"
        className="h-full w-full object-cover opacity-80"
        width={1920}
        height={1080}
      />
    </picture>
    <p className="type-label absolute bottom-6 left-1/2 -translate-x-1/2 border border-line bg-ink/70 px-3 py-2 text-mute">
      Static render · interactive 3D unavailable on this device
    </p>
  </div>
)
