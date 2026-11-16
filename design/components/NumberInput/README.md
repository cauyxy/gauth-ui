# NumberInput

A number typed or stepped. `NumberInput` in `src/components/NumberInput.tsx`.

- The box of an `Input` with a minus at the start and a plus at the end, the number centered between them. Sizes: `md` 34px (default) and `xl` 44px, chosen the way `Input`'s are.
- Use it for an exact count: questions in a set, points a question is worth, minutes on a timer. For about-right values on a short range, a `Slider` is quicker.
- The arrow keys step by `step`. The buttons step too, and they are left out of the Tab order: the field itself is the one stop.
- `min` and `max` stop the buttons at the ends. A typed number out of range comes back to the nearest end when the field loses focus.
- `value` is `null` while the field is empty. `onChange` gets the new number, or `null`.
- Put it in a `Field` for its label, hint and error. Alone, give it `label`. The unit goes in the label ("Minutes"), not in the box.
