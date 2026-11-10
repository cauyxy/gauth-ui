# Callout

A note set apart from the text around it. `Callout` in `src/components/Callout.tsx`.

- A soft ground, 12px radius, 14px text, no outline and no icon. It has `role="note"`.
- Tones: `neutral` (ink on `surface`) for a plain note, `warn` for something that needs a person's eyes, `good` for a result, `ai` (violet) for what Gauth AI made or what only the teacher sees. `neutral`, `good` and `warn` mean the same as on a `Chip`.
- The text takes the tone's color on its soft ground. Each pair reaches 4.5:1.
- The words carry the meaning, not the color: "2 students have no graded answers yet."
- `title` is one short line at 500 above the text. Most callouts do not need one.
- One callout per panel. It says something the person must know; something that just happened is a `toast()`.
