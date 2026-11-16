# Accordion

Sections that open and close under their titles. `Accordion` and `AccordionItem` in `src/components/Accordion.tsx` (Radix).

- Each section is a title line at least 44px high, 14px at 500, with a chevron at the end that turns over when it is open. A `line` rule under each section. No card around it: put it in a `Panel` when it needs one.
- `meta` is a short fact at the end of the title line, in 12px `muted`: "4 skills", "3 of 5 done".
- The open content is 14px in `ink-soft` and rises in.
- `type="single"` keeps one section open; add `collapsible` so it can close. `type="multiple"` lets each open by itself.
- Use it for content a person looks through for one part: a unit's lessons, the steps of a long solution, common questions. Content that everyone reads stays open on the page; a hint under a question is a `Reveal`.
- The arrow keys move between titles, Home and End go to the first and the last; Enter or Space opens and closes.
