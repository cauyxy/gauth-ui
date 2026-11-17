/* The examples of every component: gallery/examples/<Component>.tsx, where each `export function` is one example. */
import type { ComponentType } from 'react'
import { snippetsOf, type Snippet } from './snippet'

export { GROUPS } from './groups'

const modules = import.meta.glob<Record<string, ComponentType>>('./examples/*.tsx', { eager: true })
const sources = import.meta.glob<string>('./examples/*.tsx', { eager: true, query: '?raw', import: 'default' })

/** One example: its name, its title, the code a product would write, and the component that draws it here. */
export type Example = Snippet & { Show: ComponentType }

export function examplesOf(component: string): Example[] {
  const path = `./examples/${component}.tsx`
  if (!sources[path]) throw new Error(`${component} has no examples: add gallery/examples/${component}.tsx`)
  return snippetsOf(sources[path]).map((snippet) => ({ ...snippet, Show: modules[path]![snippet.name]! }))
}
