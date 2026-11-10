# ChipToggle

A chip to press: a filter over a list, a skill to pick. `ChipToggle` in `src/components/ChipToggle.tsx`.

- 30px high (`sm`, default) or 34px (`md`), 8px radius, 14px text at 500. An `Icon` may come first; it is 16px.
- Off: white with the control hairline. On: it stays white and gets the 1.5px ink ring and ink text. No blue fill, no grey fill.
- It is a button with `aria-pressed`. `onChange` gets the new state.
- Put a set of them in an element with `role="group"` and a name ("Filter students"). Each chip is its own Tab stop, because each one turns on and off by itself.
- For one choice out of two to five, use `Segmented`. For a fact that takes no click, use `Chip`.
- The label names what it shows, in one or two words: "Late", "Needs support". Not "Show late".
