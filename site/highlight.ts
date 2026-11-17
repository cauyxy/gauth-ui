/* The code of an example in color, as GitHub shows it: Shiki, with the TSX grammar and the github-light-default theme. The site loads this file when a block of code first opens, so the first page does not carry it. */
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import tsx from 'shiki/langs/tsx.mjs'
import githubLight from 'shiki/themes/github-light-default.mjs'

const highlighter = await createHighlighterCore({ langs: [tsx], themes: [githubLight], engine: createJavaScriptRegexEngine() })

/** The code as its lines, each a list of pieces of text with their color. A comment's gray is under 4.5:1 on `surface`, so it takes `muted`. */
export const tokensOf = (code: string) =>
  highlighter.codeToTokensBase(code, { lang: 'tsx', theme: 'github-light-default', colorReplacements: { '#6e7781': 'var(--gx-color-muted)' } })
