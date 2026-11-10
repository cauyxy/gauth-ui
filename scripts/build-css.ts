/*
 * Writes the style files of the package:
 *   dist/styles.css   src/styles.css with every @import inlined (tokens, base, all components)
 *   dist/tokens.css   the tokens alone
 *   dist/theme.css    the tokens as a Tailwind v4 theme
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

/** A CSS file with its relative `@import './x.css';` lines replaced by the files they name. */
export function inline(file: string): string {
  return readFileSync(file, 'utf8').replace(/^@import\s+['"](\.[^'"]+)['"];\s*$/gm, (_, path: string) =>
    inline(resolve(dirname(file), path)).trimEnd(),
  )
}

if (import.meta.main) {
  mkdirSync(`${ROOT}dist`, { recursive: true })
  writeFileSync(`${ROOT}dist/styles.css`, inline(`${ROOT}src/styles.css`))
  copyFileSync(`${ROOT}src/styles/tokens.css`, `${ROOT}dist/tokens.css`)
  copyFileSync(`${ROOT}src/styles/theme.css`, `${ROOT}dist/theme.css`)
}
