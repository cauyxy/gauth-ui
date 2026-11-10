/*
 * An example file as the code a product would write. Each `export function` of the file is one example; its snippet is that
 * function, the helpers of the file it uses, and its imports, written from the package (`gauth-ui`), not from this repository.
 */
export type Snippet = { name: string; title: string; code: string }

/** Where an example may import from, and what a product writes instead. */
const FROM: Record<string, string> = { '../../src': 'gauth-ui', '../../src/math': 'gauth-ui/math', react: 'react' }
const IMPORT = /^import \{([\s\S]*?)\} from '([^']+)'\n/gm
const uses = (code: string, name: string) => new RegExp(`(?<![\\w.])${name}(?!\\w)`).test(code)

export function snippetsOf(source: string): Snippet[] {
  const imports = [...source.matchAll(IMPORT)].map((m) => ({ names: m[1]!.split(',').map((n) => n.trim()).filter(Boolean), from: m[2]! })) // prettier-ignore
  for (const { from } of imports) if (!FROM[from]) throw new Error(`An example imports from '${from}'. It may use the package's entries and react only.`)

  /* The file below its imports, cut at each declaration that starts a line. A comment above a declaration goes with it. */
  const lines = source.replace(IMPORT, '').trim().split('\n')
  const starts = lines.flatMap((line, i) => {
    const declared = line.match(/^(export )?(?:function|const|type) (\w+)/)
    if (!declared) return []
    let at = i
    while (at > 0 && /^(?:\/\*| \*|\/\/)/.test(lines[at - 1]!)) at--
    return [{ at, name: declared[2]!, exported: Boolean(declared[1]) }]
  })
  const blocks = starts.map((start, i) => ({ ...start, text: lines.slice(start.at, starts[i + 1]?.at).join('\n').trim() }))

  return blocks
    .filter((block) => block.exported)
    .map((example) => {
      const helpers = new Set<(typeof blocks)[number]>()
      for (let code = example.text, found = true; found; ) {
        found = false
        for (const block of blocks)
          if (!block.exported && !helpers.has(block) && uses(code, block.name)) {
            helpers.add(block)
            code += block.text
            found = true
          }
      }
      const body = [...blocks.filter((block) => helpers.has(block)), example].map((block) => block.text).join('\n\n')
      const head = imports
        .map(({ names, from }) => ({ names: names.filter((name) => uses(body, name.replace(/^type /, ''))), from: FROM[from]! }))
        .filter(({ names }) => names.length)
        .map(({ names, from }) => `import { ${names.join(', ')} } from '${from}'`)
      return { name: example.name, title: example.name.replace(/([a-z0-9])([A-Z])/g, (_, a: string, b: string) => `${a} ${b.toLowerCase()}`), code: `${head.join('\n')}\n\n${body}\n` }
    })
}
