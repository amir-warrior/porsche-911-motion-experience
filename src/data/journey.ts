export interface JourneyChapter {
  readonly index: string
  readonly kicker: string
  readonly title: string
  readonly body: string
}

/** Copy for the pinned scroll journey; one chapter per camera composition after the hero. */
export const JOURNEY_CHAPTERS: readonly JourneyChapter[] = [
  {
    index: '01',
    kicker: 'Face',
    title: 'Four points of light',
    body: 'Tinted headlight units carry every front lighting function. The four-point signature stays lit in every mode, dipped and main beam alike.',
  },
  {
    index: '02',
    kicker: 'Silhouette',
    title: 'One line since 1963',
    body: 'The roofline still falls in a single gesture to the tail. Front arches sit 45 mm wider than a 911 Carrera; the rear adds another 20 mm.',
  },
  {
    index: '03',
    kicker: 'Tail',
    title: 'Air, managed',
    body: 'An active rear wing trims lift at speed and folds into its most efficient position when drag matters more than downforce.',
  },
  {
    index: '04',
    kicker: 'Contact',
    title: 'Turbonite detail',
    body: 'An anthracite tone reserved for Turbo models marks the wheel centre caps, the crest, the wing slats and the side window surrounds.',
  },
  {
    index: '05',
    kicker: 'Plan view',
    title: 'Wide by design',
    body: 'From above the proportion is unmistakable: a compact cabin, a long tail and haunches shaped around an all-wheel-drive hybrid powertrain.',
  },
]
