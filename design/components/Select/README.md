# Select

One choice from a list, with the browser's own menu. `Select` in `src/components/Select.tsx`.

- The same box as `Input`, with the value at 500 and a chevron at the end. Sizes: `sm` 30px, `md` 34px (default) and `xl` 44px.
- `sm` is for a dense filter row, beside small buttons and `ChipToggle`s: 8px radius, 14px text. A form uses `md`; a student page or a phone uses `xl`.
- Use it for six or more choices, or where space is tight. For two to five choices that fit side by side, use `Segmented`.
- Options are `{ value, label }`. `onChange` gets the new value.
- Put it in a `Field` for its label, hint and error. Alone, give it `label` for screen readers.
- It always has a value: the first option is a real choice, not "Select…".
