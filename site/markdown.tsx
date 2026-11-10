import { marked, type Tokens } from 'marked'
import { useMemo } from 'react'
import { routeOf } from './content'

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* Links go to the site's own pages; a link to a file the site does not show is plain text. Tables scroll in their own box. */
const renderer = new marked.Renderer()
const table = renderer.table.bind(renderer)
renderer.link = function ({ href, tokens }: Tokens.Link) {
  const text = this.parser.parseInline(tokens)
  const to = routeOf(href)
  return to ? `<a href="${escape(to)}">${text}</a>` : text
}
renderer.table = (token: Tokens.Table) => `<div class="s-table">${table(token)}</div>`

/** A Markdown text from the repository, as it is written there. The text is ours, so its HTML is trusted. */
export function Markdown({ text }: { text: string }) {
  const html = useMemo(() => marked.parse(text, { renderer, async: false }), [text])
  return <div className="s-prose" dangerouslySetInnerHTML={{ __html: html }} />
}
