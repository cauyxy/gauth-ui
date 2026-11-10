# Checkbox

A yes or no for one item of a list: a standard to cover, a student to include. `Checkbox` in `src/components/Checkbox.tsx`.

- An 18px box with a 6px radius. Checked is ink with a white check; not checked is a 1.5px `ring` outline on white.
- Its text is 14px and sits 10px after the box. A click on the text also checks it.
- With no visible text (a table row), give it `label` for screen readers.
- For a setting that takes effect at once, use `Switch`. For one choice out of a few, use `Segmented`.
- Disabled is half opacity.
