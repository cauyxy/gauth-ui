# RadioGroup

One choice from a short list, each option on its own line. `RadioGroup` in `src/components/RadioGroup.tsx` (Radix).

- An 18px circle, then the text at 14px, 10px apart. Not picked: the 1.5px `ring` outline on white. Picked: an ink circle with a white dot, the look of a checked `Checkbox`.
- An option may have a `description`: a second line in 12px `muted` that says what the choice does ("Students see it on the day you pick.").
- Use it when the options need a sentence each, or there are more than five. For two to five short options side by side, use `Segmented`; for a long list, `Select`.
- `vertical` (default) puts one option per line; `horizontal` puts them in a row that wraps.
- `label` names the group for a screen reader. Where the page shows a heading for it, use the same words.
- It is one Tab stop: the arrow keys move the pick, as in every radio group. A click on the text also picks.
- `value` may be `null` when nothing is picked yet; `onChange` gets the new value.
