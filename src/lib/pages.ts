export const pages = {
  store: {
    label: 'store',
    title: 'Store',
    description: 'A future home for things I make. Nothing on the shelves yet.',
    status: 'No items listed yet.',
  },
  'open-source': {
    label: 'open source',
    title: 'Open Source',
    description: 'A place for my projects, experiments, and contributions.',
    status: 'Project list coming soon.',
  },
  astronomy: {
    label: 'astronomy',
    title: 'Astronomy',
    description: 'A little corner of the internet for looking up at the sky.',
    status: 'Observations and notes coming soon.',
  },
} as const

export type Page = keyof typeof pages
