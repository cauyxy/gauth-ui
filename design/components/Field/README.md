# Field

A label above one control, with a hint or an error below it. `Field` and `useField` in `src/components/Field.tsx`.

- The label is 14px at 500. The hint is 12px in `muted`. The gap between the three is 6px.
- It holds one control: `Input`, `Textarea`, `Select`, `Combobox`, `NumberInput`, `DatePicker` or `DateRangePicker`. The control takes its `id`, `aria-describedby` and `aria-invalid` from the Field, so the label names it and the hint or error describes it. Inside a Field the control's own `label` is not used.
- A control a product writes joins a Field with `useField(label)`: spread its `props` on the element that takes focus. Outside a Field, `label` is then the control's accessible name.
- The look of the box (its outline, its focus ring, its error) is `fieldBox` in `src/components/Field.classes.ts`, the same for every control.
- An error replaces the hint. It is 12px at 500 in `attempted-ink`, and the control gets an `attempted` outline on an `attempted-soft` ground. Nothing is red.
- An error says what to do next: "A code has 8 letters." Not "Invalid input".
- Leave the hint out when the label already says it.
- A Field is as wide as its container. The page sets the width.
