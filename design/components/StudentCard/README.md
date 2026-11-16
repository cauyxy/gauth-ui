# StudentCard

The card a student page is built from. `StudentCard` and `StudentCardTitle` in `src/learning/StudentCard.tsx`.

- 24px radius, 20px padding. Plain, it is white with `shadow-edge`, like a `Panel` with larger corners.
- With a `tone`, the whole card takes that meaning's soft ground and has no hairline: `violet` for a goal, XP or a streak; `good` for something done or right; `pink` for a celebration, at the moment it happens.
- With `level`, the card takes the soft ground of the level a student reached. Use it for the moment a level changes, not for every skill in a list: a list uses `LevelChip`.
- `StudentCardTitle` is 18px at 600, in the text color its card's ground allows. Other text in the card stays ink.
- **Soft grounds are few.** One screen has two cards with a soft ground at most while a student works, and four at most on a summary. Every other card is plain. When every card has a color, none of them says anything.
- Only these meanings take a ground. A subject, a lesson, a setting or a plain fact stays on a plain card.
- An `IconBox` on a card with a soft ground is white: `<IconBox tone="violet" className="bg-white">`.
- A staff page uses `Panel`.
