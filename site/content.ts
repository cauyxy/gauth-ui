/* What the site shows and where: the pages, read from the repository's own Markdown, and the component groups of the gallery. */
import type { ComponentType } from 'react'
import design from '../design/README.md?raw'
import Core from '../gallery/core'
import Forms from '../gallery/forms'
import Learning from '../gallery/learning'
import Formulas from '../gallery/math'
import Overlays from '../gallery/overlays'
import Structure from '../gallery/structure'
import glossary from '../GLOSSARY.md?raw'
import readme from '../README.md?raw'

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** A Markdown file as its `## ` sections, in order. */
const sections = (markdown: string) =>
  markdown
    .split(/^(?=## )/m)
    .filter((part) => part.startsWith('## '))
    .map((part) => ({ title: part.slice(3, part.indexOf('\n')).trim(), body: part.slice(part.indexOf('\n') + 1) }))

/** The component groups: a page each, with the gallery's live examples. `names` are the components on it, in order. */
export const GROUPS: { slug: string; title: string; Examples: ComponentType; names: string[] }[] = [
  { slug: 'basics', title: 'Basics', Examples: Core, names: ['Button', 'Segmented', 'Switch', 'Chip', 'Avatar', 'Dot', 'IconBox', 'Panel', 'Stat', 'Tooltip', 'Popover', 'Meter', 'Progress', 'Spinner', 'Skeleton'] },
  { slug: 'forms', title: 'Forms', Examples: Forms, names: ['Field', 'Input', 'Textarea', 'Select', 'Checkbox'] },
  { slug: 'overlays', title: 'Overlays and feedback', Examples: Overlays, names: ['Dialog', 'Menu', 'Toast', 'EmptyState', 'Callout'] },
  { slug: 'structure', title: 'Structure and Gauth AI', Examples: Structure, names: ['Breadcrumbs', 'PageTitle', 'Tabs', 'Table', 'Stepper', 'Composer', 'Generating'] },
  { slug: 'learning', title: 'Learning', Examples: Learning, names: ['LevelMark', 'LevelChip', 'LevelLadder', 'LevelBar', 'AnswerOption', 'Reveal', 'WorkedSteps', 'StepProgress'] },
  { slug: 'math', title: 'Math', Examples: Formulas, names: ['Tex', 'RichText'] },
]

/** Each component's guideline, by name. */
export const GUIDELINES = Object.fromEntries(
  Object.entries(import.meta.glob<string>('../design/components/*/README.md', { query: '?raw', import: 'default', eager: true })).map(([path, text]) => [
    path.split('/').at(-2)!,
    /* The page already shows the name as a heading. */
    text.replace(/^# .*\n+/, ''),
  ]),
)

export type Page = { path: string; title: string; group: string } & ({ kind: 'markdown'; body: string } | { kind: 'tokens' } | { kind: 'components'; slug: string })

const start = readme.slice(readme.indexOf('\n') + 1, readme.indexOf('## Components'))

export const PAGES: Page[] = [
  { path: '/', title: 'Start', group: 'Start', kind: 'markdown', body: start },
  ...sections(design)
    .filter((s) => s.title !== 'Components')
    .map((s): Page => ({ path: `/design/${slug(s.title)}`, title: s.title, group: 'Design', kind: 'markdown', body: s.body })),
  { path: '/tokens', title: 'Tokens', group: 'Design', kind: 'tokens' },
  { path: '/glossary', title: 'Glossary', group: 'Design', kind: 'markdown', body: glossary.slice(glossary.indexOf('\n') + 1) },
  ...GROUPS.map((g): Page => ({ path: `/components/${g.slug}`, title: g.title, group: 'Components', kind: 'components', slug: g.slug })),
]

/** Where a link written in the Markdown goes on the site. A link to a file the site does not show stays as text. */
export function routeOf(href: string): string | null {
  if (/^(https?:|mailto:|#)/.test(href)) return href
  const component = href.match(/components\/(\w+)\/README\.md/)?.[1]
  if (component) {
    const group = GROUPS.find((g) => g.names.includes(component))
    return group ? `/components/${group.slug}#${component}` : null
  }
  if (/GLOSSARY\.md/.test(href)) return '/glossary'
  if (/design\/README\.md/.test(href)) return '/design/content'
  if (/design\/components\/?$/.test(href)) return '/components/basics'
  return null
}
