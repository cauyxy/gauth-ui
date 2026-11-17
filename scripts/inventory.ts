/*
 * The components of the package, from the files in src/: one list that every check, script and build reads. Each place
 * that lists the components by hand (src/index.ts, GROUPS in gallery/groups.ts, the Components table of design/README.md,
 * README.md, the cases of props.test.tsx) is tested against it.
 *
 * A component is a file `src/<dir>/<Name>.tsx` that is not a test. Beside it are its test, its guideline
 * (design/components/<Name>/README.md) and its examples (gallery/examples/<Name>.tsx).
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'

/* import.meta.dirname: a test in jsdom gives this file an http URL, not a file one. */
const ROOT = `${dirname(import.meta.dirname)}/`

export type Group = 'core' | 'learning' | 'math'
export type Component = { name: string; group: Group; dir: 'components' | 'learning' | 'math' }

const filesOf = (dir: Component['dir'], group: Group): Component[] =>
  readdirSync(`${ROOT}src/${dir}`)
    .filter((f) => /^[A-Z]\w*\.tsx$/.test(f) && !f.endsWith('.test.tsx'))
    .map((f) => ({ name: f.slice(0, -'.tsx'.length), group, dir }))
    .toSorted((a, b) => a.name.localeCompare(b.name))

/** Every component: core, then learning, then math, each by name. */
export const COMPONENTS: Component[] = [...filesOf('components', 'core'), ...filesOf('learning', 'learning'), ...filesOf('math', 'math')]
export const NAMES = COMPONENTS.map((c) => c.name)
export const namesOf = (group: Group) => COMPONENTS.filter((c) => c.group === group).map((c) => c.name)

/** What is wrong with a list that must name every component once: the names it leaves out, the names that are not components, the names it has twice. */
export function differences(listed: string[]) {
  return [
    ...NAMES.filter((name) => !listed.includes(name)).map((name) => `${name} is missing`),
    ...listed.filter((name) => !NAMES.includes(name)).map((name) => `${name} is not a component`),
    ...listed.filter((name, i) => listed.indexOf(name) !== i).map((name) => `${name} is there twice`),
  ]
}

/** The components in the groups of the Components table of design/README.md. Throws when the table does not list each component once. */
export function readmeGroups() {
  const found: { group: string; name: string }[] = []
  for (const line of readFileSync(`${ROOT}design/README.md`, 'utf8').split('\n')) {
    const row = line.match(/^\| ([\w ]+?)\s*\| (\[.+)\|\s*$/)
    if (row) for (const m of row[2]!.matchAll(/\[(\w+)\]\(components\//g)) found.push({ group: row[1]!, name: m[1]! })
  }
  const wrong = differences(found.map((c) => c.name))
  if (wrong.length) throw new Error(`the Components table of design/README.md: ${wrong.join(', ')}`)
  return found
}
