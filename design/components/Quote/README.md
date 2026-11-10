# Quote

Text quoted from a reply or a document, shown above what is being written. `Quote` in `src/learning/Quote.tsx`.

- A 3px `rule` bar at the start, then the text in `muted` at 14px. No ground and no outline: the bar is its one weight.
- At most two lines. The quote points at the text; the full text stays where it came from.
- With `onRemove` it ends with a small close button named "Remove". Use it in the `before` of a `Composer`. Leave it out in a sent message.
- It is a `<blockquote>`.
