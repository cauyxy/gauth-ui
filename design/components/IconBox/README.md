# IconBox

A line icon on a square: what kind of thing a row is, or what the icon means. `IconBox` in `src/components/IconBox.tsx`.

- 32px square by default, 8px radius, `surface` ground, ink icon. `size` is in pixels.
- Neutral by default: kinds (a lesson, a quiz, a subject, a tool) are told apart by shape. A staff page uses neutral only.
- `tone` is for an icon that carries one of the color meanings, with the same names as a `Chip`: `violet` for XP, a streak, a goal or a badge; `good` for done or right; `pink` for a celebration; `blue` for a standard; `warn` for something that needs a person's eyes. The icon takes the tone's color on its soft ground.
- A subject never takes a tone: a subject has no color of its own.
- On a card that already has the tone's ground (a `StudentCard`), put the square on white: `className="bg-white"`.
