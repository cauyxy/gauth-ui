# Chip

A short fact attached to a row: a standard code, where a question came from, or what a check found. `Chip` in `src/components/Chip.tsx`.

- 24px high, 6px radius, 12px text at 500, 9px side padding.
- `neutral` has an outline and no fill. A fill is for a fact with a meaning.
- Tones: `neutral` for plain facts, `blue` for standard codes, `good` for checks, `warn` for anything that needs a person's eyes, `violet` for XP and Gauth AI, `pink` for celebration, `ink` for the one emphatic fact.
- Write a standard code the way the standard writes it ("A-REI.B.3").
- One chip per fact. A row with more than three is doing too much.
