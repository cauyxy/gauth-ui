/*
 * Writes the style files of the package:
 *   dist/styles.css   src/styles.css with its own files inlined: the tokens, the Tailwind theme, the base styles, and
 *                     an @source that points Tailwind at the built components beside it
 *   dist/tokens.css   the tokens alone
 *   dist/theme.css    the tokens as a Tailwind v4 theme
 *   dist/math.css     KaTeX's styles (still an import of the katex package) and how a formula sits in Gauth text
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

/** A CSS file with its relative `@import './x.css';` lines replaced by the files they name. An import into a layer becomes that layer. */
export function inline(file: string): string {
  return readFileSync(file, 'utf8').replace(/^@import\s+['"](\.[^'"]+)['"](?:\s+layer\((\w+)\))?;\s*$/gm, (_, path: string, layer?: string) => {
    const css = inline(resolve(dirname(file), path)).trimEnd()
    return layer ? `@layer ${layer} {\n${css}\n}` : css
  })
}

if (import.meta.main) {
  mkdirSync(`${ROOT}dist`, { recursive: true })
  writeFileSync(`${ROOT}dist/styles.css`, inline(`${ROOT}src/styles.css`))
  copyFileSync(`${ROOT}src/styles/tokens.css`, `${ROOT}dist/tokens.css`)
  copyFileSync(`${ROOT}src/styles/theme.css`, `${ROOT}dist/theme.css`)
  copyFileSync(`${ROOT}src/math/math.css`, `${ROOT}dist/math.css`)
}
