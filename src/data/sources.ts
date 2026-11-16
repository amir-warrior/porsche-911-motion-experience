/** Primary sources — official Porsche Newsroom press kit for the 911 Turbo S (992.2). */
export const SOURCES = {
  pressKit: 'https://newsroom.porsche.com/en/press-kits/pfv-porsche-911-turbo-s.html',
  powertrain:
    'https://newsroom.porsche.com/en/press-kits/pfv-porsche-911-turbo-s/Powertrain.html',
  aero: 'https://newsroom.porsche.com/en/press-kits/pfv-porsche-911-turbo-s/Body,-aerodynamics-and-design.html',
  datasheet:
    'https://newsroom.porsche.com/dam/jcr%3Abe13fd23-11cf-4783-b509-a702aed10df3/pag-911-turbo-s-en.pdf',
} as const

export type SourceKey = keyof typeof SOURCES
