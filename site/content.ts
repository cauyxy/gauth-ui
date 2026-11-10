/* What the site shows and where: a page for each component with the gallery's live examples, and the pages read from the repository's own Markdown. */
import type { ComponentType } from 'react'
import design from '../design/README.md?raw'
import Chat from '../gallery/chat'
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

/** The component groups. `Examples` draws every block of the group; `names` are its components, in order, each with a page. */
export const GROUPS: { slug: string; title: string; Examples: ComponentType; names: string[] }[] = [
  { slug: 'basics', title: 'Basics', Examples: Core, names: ['Button', 'IconButton', 'Segmented', 'Switch', 'Chip', 'ChipToggle', 'Avatar', 'Dot', 'IconBox', 'Panel', 'Stat', 'CoverCard', 'Tooltip', 'Popover', 'Meter', 'Progress', 'Spinner', 'Skeleton'] },
  { slug: 'forms', title: 'Forms', Examples: Forms, names: ['Field', 'Input', 'Textarea', 'Select', 'Checkbox'] },
  { slug: 'overlays', title: 'Overlays and feedback', Examples: Overlays, names: ['Dialog', 'Menu', 'Toast', 'EmptyState', 'Callout'] },
  { slug: 'structure', title: 'Structure and Gauth AI', Examples: Structure, names: ['Breadcrumbs', 'PageTitle', 'Tabs', 'Table', 'Stepper', 'Composer', 'Generating'] },
  { slug: 'conversation', title: 'Conversation', Examples: Chat, names: ['Message', 'AiStatus', 'ReplyActions', 'FollowUps', 'Quote'] },
  { slug: 'learning', title: 'Learning', Examples: Learning, names: ['LevelMark', 'LevelChip', 'LevelLadder', 'LevelBar', 'AnswerOption', 'Reveal', 'WorkedSteps', 'StepProgress'] },
  { slug: 'math', title: 'Math', Examples: Formulas, names: ['Tex', 'RichText'] },
]

/** Each component's guideline, by name: the sentence that says what it is, and its rules. */
export const GUIDELINES = Object.fromEntries(
  Object.entries(import.meta.glob<string>('../design/components/*/README.md', { query: '?raw', import: 'default', eager: true })).map(([path, text]) => {
    /* The page already shows the name as a heading. */
    const body = text.replace(/^# .*\n+/, '')
    const end = body.indexOf('\n\n')
    return [path.split('/').at(-2)!, end < 0 ? { lead: body, rules: '' } : { lead: body.slice(0, end), rules: body.slice(end + 2) }]
  }),
)

export const pathOf = (component: string) => `/components/${component.toLowerCase()}`

/** `group` is the title the page sits under in the list of pages; the first pages have none. */
export type Page = { path: string; title: string; group: string } & (
  | { kind: 'home' }
  | { kind: 'markdown'; body: string }
  | { kind: 'tokens' }
  | { kind: 'component'; name: string; slug: string }
)

const start = readme.slice(readme.indexOf('\n') + 1, readme.indexOf('## Components'))

export const PAGES: Page[] = [
  { path: '/', title: 'Components', group: '', kind: 'home' },
  { path: '/install', title: 'Install', group: '', kind: 'markdown', body: start },
  ...GROUPS.flatMap((g) => g.names.map((name): Page => ({ path: pathOf(name), title: name, group: g.title, kind: 'component', name, slug: g.slug }))),
  ...sections(design)
    .filter((s) => s.title !== 'Components')
    .map((s): Page => ({ path: `/design/${slug(s.title)}`, title: s.title, group: 'Design', kind: 'markdown', body: s.body })),
  { path: '/tokens', title: 'Tokens', group: 'Design', kind: 'tokens' },
  { path: '/glossary', title: 'Glossary', group: 'Design', kind: 'markdown', body: glossary.slice(glossary.indexOf('\n') + 1) },
]

/** Where a link written in the Markdown goes on the site. A link to a file the site does not show stays as text. */
export function routeOf(href: string): string | null {
  if (/^(https?:|mailto:|#)/.test(href)) return href
  const component = href.match(/components\/(\w+)\/README\.md/)?.[1]
  if (component) return GROUPS.some((g) => g.names.includes(component)) ? pathOf(component) : null
  if (/GLOSSARY\.md/.test(href)) return '/glossary'
  if (/design\/README\.md/.test(href)) return '/design/content'
  if (/design\/components\/?$/.test(href)) return '/'
  return null
}
