# Segmented

Two to five choices side by side, the picked one raised. `Segmented` in `src/components/Segmented.tsx`.

- A `line-2` track with 4px padding; options are 28px high, 14px semibold, 8px radius. The picked option is white with `shadow-raise`; the others are `muted`, ink on hover.
- `fill` stretches it to its container with equal options (form fields, panel headers). Without it, it is as wide as its labels and wraps on a phone.
- It is a `radiogroup`. When the options are links, use `segmentedTrackClass()` and `segmentedOptionClass(on)` instead of rebuilding the look.
