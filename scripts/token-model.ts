/*
 * The tokens of src/styles/tokens.css as data. Every tool that needs a token reads it here: scripts/tokens.ts (the files
 * made from tokens.css), the tests, the gallery's type and motion pages and the Design System artifact.
 * It imports nothing from Node: the gallery runs it in the browser, on tokens.css imported as text.
 */

/** One `--gx-*` token. */
export type Token = {
  /** The name without `--gx-`: `color-ink`, `font-weight-control`. */
  name: string
  /** What the name starts with: `color`, `font`, `font-weight`, `space`, `h`. */
  family: string
  /** The name without its family: `ink`, `control`, `0-5`. */
  key: string
  value: string
  /** The comment above its group. */
  group: string
  /** The comment at the end of its own line, or ''. */
  note: string
  /** What the token is for: its note, or its group's comment when it has none. */
  usage: string
}

/** `font-weight-*` starts with `font-` too, and is a family of its own. */
const familyOf = (name: string) => (name.startsWith('font-weight-') ? 'font-weight' : name.split('-')[0]!)

/** Every `--gx-name: value;` under `:root`, in the order of the file. */
export function parse(css: string): Token[] {
  const block = css.match(/:root\s*\{([\s\S]*?)\n\s*\}/)?.[1]
  if (!block) throw new Error('no :root block in tokens.css')
  const tokens: Token[] = []
  let group = ''
  for (const raw of block.split('\n')) {
    const line = raw.trim()
    const comment = line.match(/^\/\*\s*(.*?)\s*\*\/$/)
    if (comment) {
      group = comment[1]!
      continue
    }
    const decl = line.match(/^--gx-([\w-]+):\s*(.+?);\s*(?:\/\*\s*(.*?)\s*\*\/)?$/)
    if (!decl) continue
    const [name, value, note = ''] = [decl[1]!, decl[2]!, decl[3]]
    const family = familyOf(name)
    tokens.push({ name, family, key: name.slice(family.length + 1), value, group, note, usage: note || group })
  }
  return tokens
}

/** The tokens of one family, in the order of the file. */
export const familyTokens = (tokens: Token[], family: string) => tokens.filter((t) => t.family === family)

/** The keys of one family: `keysOf(tokens, 'radius')` is xs, sm, md … */
export const keysOf = (tokens: Token[], family: string) => familyTokens(tokens, family).map((t) => t.key)
