# Input

One line of text. `Input` in `src/components/Input.tsx`.

- Sizes: `md` 34px (default) with 14px text and an 8px radius; `xl` 44px with 16px text and a 16px radius. Staff pages use `md`. Student pages use `xl`: 16px text stops a phone from zooming in.
- `outline` is white with the `edge-strong` hairline. `search` has a `surface` ground, no outline and the search icon at its start.
- The placeholder is `muted`. It is an example of the value, not the label.
- Put it in a `Field` for its label, hint and error. Alone, give it `label`.
- An error is an `attempted` outline on an `attempted-soft` ground; the Field's text says what is wrong. Disabled is half opacity.
- `onChange` gets the new text. `className` goes to the wrapper; other props go to the `<input>`.
