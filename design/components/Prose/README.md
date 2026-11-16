# Prose

Long text: a lesson, an explanation, a reading passage, a help page. `Prose` in `src/components/Prose.tsx`.

- Put plain elements in it: `h2` to `h4`, `p`, `ul`, `ol`, `blockquote`, `figure` with a `figcaption`, `dl`, `table`, `hr`, `code`, `pre`, `a`, `strong`. Text that comes from Markdown is these elements already.
- `size` is the size of the running text: `sm` 14px on a staff page, `md` 16px (default), `lg` 18px where a student reads a problem or a lesson. Line height is `leading-body`, and lines break with `text-wrap: pretty`.
- It is `container-read` (720px) wide at most. A wider page sets its own width with `className`.
- A heading in the text is `h2`: two steps above the text (18, 20 or 24px) at 600. `h3` and `h4` are the size of the text at 600. The page's own title is a `PageTitle`, not an `h1` here.
- A heading belongs to what follows: 40px above an `h2`, 24px above an `h3`, then 12 or 8px below. Blocks are 16px apart.
- A link is `blue` and underlined, so it is not color alone. Strong text is 600, never 700.
- A quote has a 3px `rule` bar at its start and no ground. A list's marks are `faint`. A table's head is quiet (11px, uppercase, `muted`), its rows are divided by `line`, and its numbers line up.
- A figure's caption is `muted`, one step under the text. Give the picture its `alt`.
- A term and its meaning are a `dl`: the term at 600, the meaning in `ink-soft` under it.
- A block of code wraps. It does not scroll sideways, because a box that scrolls cannot be reached from the keyboard.
- A formula is a `Tex` or a `RichText` from `gauth-ui/math`, inside a paragraph or on its own line. A note, a hint or worked steps go between two paragraphs as `Callout`, `Reveal` or `WorkedSteps`: they keep their own look.
- It sets only what stands directly in the text, and each rule weighs less than a class: a class on an element inside wins.
