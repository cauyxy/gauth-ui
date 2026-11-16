/* The examples of every component: gallery/examples/<Component>.tsx, where each `export function` is one example. */
import type { ComponentType } from 'react'
import { snippetsOf, type Snippet } from './snippet'

const modules = import.meta.glob<Record<string, ComponentType>>('./examples/*.tsx', { eager: true })
const sources = import.meta.glob<string>('./examples/*.tsx', { eager: true, query: '?raw', import: 'default' })

/** The components in the order the gallery and the docs site show them. */
export const GROUPS: { slug: string; title: string; names: string[] }[] = [
  {
    slug: 'basics',
    title: 'Basics',
    names: [
      'Button',
      'IconButton',
      'Segmented',
      'Switch',
      'Chip',
      'ChipToggle',
      'Avatar',
      'Dot',
      'IconBox',
      'Panel',
      'Stat',
      'CoverCard',
      'Tooltip',
      'Popover',
      'Meter',
      'Progress',
      'Spinner',
      'Skeleton',
    ],
  },
  { slug: 'forms', title: 'Forms', names: ['Field', 'Input', 'Textarea', 'Select', 'DatePicker', 'Checkbox'] },
  { slug: 'overlays', title: 'Overlays and feedback', names: ['Dialog', 'Menu', 'Toast', 'EmptyState', 'Callout'] },
  { slug: 'structure', title: 'Structure and Gauth AI', names: ['Breadcrumbs', 'PageTitle', 'Tabs', 'Table', 'Stepper', 'Composer', 'Generating'] },
  { slug: 'conversation', title: 'Conversation', names: ['Message', 'AiStatus', 'ReplyActions', 'FollowUps', 'Quote'] },
  {
    slug: 'learning',
    title: 'Learning',
    names: ['LevelMark', 'LevelChip', 'LevelLadder', 'LevelBar', 'AnswerOption', 'Reveal', 'WorkedSteps', 'StepProgress'],
  },
  { slug: 'math', title: 'Math', names: ['Tex', 'RichText'] },
]

/** One example: its name, its title, the code a product would write, and the component that draws it here. */
export type Example = Snippet & { Show: ComponentType }

export function examplesOf(component: string): Example[] {
  const path = `./examples/${component}.tsx`
  if (!sources[path]) throw new Error(`${component} has no examples: add gallery/examples/${component}.tsx`)
  return snippetsOf(sources[path]).map((snippet) => ({ ...snippet, Show: modules[path]![snippet.name]! }))
}
