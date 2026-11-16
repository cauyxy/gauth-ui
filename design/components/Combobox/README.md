# Combobox

One choice from a long list, found by typing. `Combobox` in `src/components/Combobox.tsx` (Radix popover).

- The field is the box of an `Input` with a chevron at the end. Sizes: `md` 34px (default) and `xl` 44px.
- The list opens under the field, as wide as it, with the look of a `Menu`: rows 34px high, 14px at 500, the row under the pointer or the arrow keys on `surface`, a check at the end of the picked one. An option may have a `description`: a second line in 12px `muted` ("Period 3").
- Typing filters the list by the label and the description. When nothing matches, it says "No matches".
- Use it for a list too long to read through: students of a school, standards, schools of a district. For under about 15 options, `Select` is simpler.
- The keyboard: typing opens the list; the arrow keys move through it, Enter picks, Escape closes. Focus stays in the field the whole time. When the field loses focus, the text goes back to the picked option's label.
- `value` is `null` until something is picked; `onChange` gets the new value. Use `placeholder` for what to type ("Type a name").
- Put it in a `Field` for its label, hint and error. Alone, give it `label`.
